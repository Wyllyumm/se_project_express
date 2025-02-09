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
/* const corsOptions = {
  origin: "https://idk-wtwr.mindhackers.org/",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "authorization"],
}; */

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
app.use(cors());
app.use(limiter);
app.use(requestLogger);

/* app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
}); */

app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
