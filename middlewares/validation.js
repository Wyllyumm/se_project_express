const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.email");
};

const validateCreateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string()
      .required()
      .messages({ "string.empty": 'The "name" field must be filled in' }),
  }),
});

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "name" field is 8',
      "string.empty": 'The "name" field must be filled in',
    }),
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "name" field is 8',
      "string.empty": 'The "name" field must be filled in',
    }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateCreateClothingItem,
  validateUserSignup,
  validateUserLogin,
  validateUserId,
  validateItemId,
};
