const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 50, // each IP can make up to 50 requests per `windowsMs` (5 minutes)
  statusCode: 429,
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});

module.exports = { limiter };
