const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { error404 } = require("../utils/errors");
const NotFoundError = require("../errors/notFoundError");
const { login, createUser } = require("../controllers/users");
const {
  validateUserSignup,
  validateUserLogin,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.post("/signup", validateUserSignup, createUser);
router.post("/signin", validateUserLogin, login);

router.use((req, res) => {
  /* res.status(error404.status).send({ message: "Router not found" }); */
  throw new NotFoundError("Router not found");
});

module.exports = router;
