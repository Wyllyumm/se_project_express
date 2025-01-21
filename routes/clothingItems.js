const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { auth } = require("../middlewares/auth");
const {
  validateCreateClothingItem,
  validateItemId,
  validateId,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", validateCreateClothingItem, auth, createItem);
router.delete("/:itemId", validateItemId, auth, deleteItem);
router.put("/:itemId/likes", validateItemId, auth, likeItem);
router.delete("/:itemId/likes", validateItemId, auth, dislikeItem);

module.exports = router;
