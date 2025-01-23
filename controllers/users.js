const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/badRequestError");
const ConflictError = require("../errors/conflictError");
const InternalServerError = require("../errors/internalServerError");
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
            })
        )
        .catch((err) => {
          console.error(err);
          return next(new InternalServerError(err.message));
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
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
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
      handleRepeatErrors(err, res, next);
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
      handleRepeatErrors(err, res, next);
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
