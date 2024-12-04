const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");

const app = express();
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

/*app.use((req, res, next) => {
  req.user = {
    _id: "672a3c6e74493913bd7272cf",
  };
  next();
});*/

app.use(express.json());

app.use("/", mainRouter);

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
