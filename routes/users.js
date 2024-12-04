const router = require("express").Router();
const {
  createUser,
  getCurrentUser,
  login,
  updateProfile,
} = require("../controllers/users");
const { auth } = require("../middlewares/auth");

/* router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser); */

router.get("/me", auth, getCurrentUser);
/*router.post("/signin", login); //* */
/*router.post("/signup", createUser);  //* */
router.patch("/me", auth, updateProfile);

module.exports = router;
