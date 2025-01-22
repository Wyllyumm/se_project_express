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
const BadRequestError = require("../errors/badRequestError");
const ConflictError = require("../errors/conflictError");
const { handleRepeatErrors } = require("../middlewares/error-handler");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("Email already exists");
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({ name, avatar, email, password: hash })
            .then((user) =>
              res.status(201).send({
                name: user.name,
                avatar: user.avatar,
                email: user.email,
              })
            )

            .catch((err) => {
              console.error(err);
              handleRepeatErrors(err, res, next);
              /* if (err.statuscode === 11000) {
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
              .send({ message: error500.message }); */
            })
        )
        .catch((err) => {
          console.error(err);
          return res
            .status(error500.status)
            .send({ message: error500.message });
        });
    })
    .catch((err) => {
      console.error(err);
      handleRepeatErrors(err, res, next);
    });
};

//* getUser from previous sprint *//
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      handleRepeatErrors(err, res, next);
      /*if (err.name === "CastError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message }); */
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    /*return res.status(error400.status).send({ message: error400.message }); */
    throw new BadRequestError("Invalid data.");
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
      return res.status(error500.status).send({ message: error500.message });
    })
    .catch((err) => {
      console.error(err);
      handleRepeatErrors(err, res, next);
      /*if (err.message.includes("Incorrect email or password")) {
        return res.status(error401.status).send({ message: error401.message });
      }
      return res.status(error500.status).send({ message: error500.message }); */
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      return res.status(error500.status).send({ message: error500.message });
    })
    .catch((err) => {
      console.error(err);
      handleRepeatErrors(err, res, next);
      /* if (err.name === "ValidationError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      return res.status(error500.status).send({ message: error500.message }); */
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
