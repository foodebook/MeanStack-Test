const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  console.log('fetchedUser1111111111111111111111111111111111111111111111111111')

  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      console.log(fetchedUser)
      console.log('11111111111111111111111111111111111111111')
      console.log(bcrypt.compare(req.body.password, user.password))
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      console.log('22222222222222222222222222222222222222222222222222')
      console.log(jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      ))
      // console.log(fetchedUser)

      console.log(result)

      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      console.log('333333333333333333333333333333333333333333333333333')
      console.log(token)
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      console.log('4444444444444444444444444444444444444444444444444444444444')
      console.log(err)
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
