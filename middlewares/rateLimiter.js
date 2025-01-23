const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 150, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  message: "Too many requests from, this IP, please try again later.",
  statusCode: 429,
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});

module.exports = { limiter };
