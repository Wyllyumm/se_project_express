const { rateLimit } = require("express-rate-limit");
const RateLimitError = require("../errors/rateLimitError");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 200, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  statusCode: 429,
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  onLimitReached: (err, req, res, next) => {
    console.error(err);
    const { statusCode = 429 } = err;
    res
      .status(statusCode)
      .send({
        message: "Too many requests from, this IP, please try again later.",
      });
  },
});

module.exports = { limiter };
