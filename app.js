const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { errors } = require("celebrate");
require("dotenv").config();

const mainRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { limiter } = require("./middlewares/rateLimiter");

const app = express();
const corsOptions = {
  origin: "https://idk-wtwr.mindhackers.org/",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the db");
  })
  .catch((e) => console.error(e));

app.use(express.json());
app.use(cors(corsOptions));
app.use(requestLogger);
/* app.use(limiter); */

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
