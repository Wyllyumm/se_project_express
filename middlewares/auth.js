const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const UnauthorizedError = require("../errors/unauthorizedError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    /* return res.status(error401.status).send({ message: error401.message }); */
    throw new UnauthorizedError("Unauthorized, you shall not pass!");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    /* return res.status(error401.status).send({ message: error401.message }); */
    next(new UnauthorizedError("Unauthorized, you shall not pass!"));
  }
  req.user = payload;
  return next();
};

module.exports = { auth };
