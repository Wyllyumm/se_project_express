const router = require("express").Router();
const { error404 } = require("../utils/errors");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(error404.status).send({ message: "Router not found" });
});

module.exports = router;
