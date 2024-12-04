const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  error400,
  error404,
  error500,
  error409,
  error401,
} = require("../utils/errors");

/*const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(error500.status).send({ message: error500.message });
    });
}; */

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    return res
      .status(error400.status)
      .send({ message: "Email and password are required" });
  }

  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.status(error409.status).send({ message: error409.message });
    }
    /*}); */

    return bcrypt.hash(password, 10).then((hash) =>
      User.create({ name, avatar, email, password: hash })
        .then((user) =>
          res
            .status(201)
            .send({ name: user.name, avatar: user.avatar, email: user.email })
        )

        .catch((err) => {
          console.error(err);
          if (err.statuscode === 11000) {
            return res
              .status(error409.status)
              .send({ message: error409.message });
          }
          if (err.name === "ValidationError") {
            return res
              .status(error400.status)
              .send({ message: error400.message });
          }
          return res
            .status(error500.status)
            .send({ message: error500.message });
        })
    );
  });
};

//* getUser from previous sprint *//
const getCurrentUser = (req, res) => {
  /*const { userId } = req.user._id;*/
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(error400.status).send({ message: error400.message });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (
        err.message.includes("Incorrect email") ||
        err.message.includes("Incorrect password")
      ) {
        return res.status(error401.status).send({ message: error401.message });
      }
      return res.status(error500.status).send({ message: error500.message });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then(() => res.status(200).send({ name, avatar }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message });
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
