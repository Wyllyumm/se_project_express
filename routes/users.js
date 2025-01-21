const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const { validateId } = require("../middlewares/validation");

router.get("/me", validateId, auth, getCurrentUser);
router.patch("/me", validateId, auth, updateProfile);

module.exports = router;
