const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { error401 } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(error401.status).send({ message: error401.message });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(error401.status).send({ message: error401.message });
  }
  req.user = payload;
  return next();
};

module.exports = { auth };
