const ClothingItem = require("../models/clothingItem");
const ForbiddenError = require("../errors/forbiddenError");
const internalServerError = require("../errors/internalServerError");
const { handleRepeatErrors } = require("../middlewares/error-handler");

const createItem = (req, res, next) => {
  console.log(req);
  console.log(req.body);
  console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      /* return res.status(error500.status).send({ message: error500.message });
      throw new internalServerError(); */
      next(new internalServerError(err.message));
    })
    .catch((err) => {
      console.error(err);
      handleRepeatErrors(err, res, next);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      next(new internalServerError(err.message));
      /* the only error that would occur */
    });
};

/* code for updating item image
const updateItemImage = (req, res) => {
  const { itemId } = req.params; /* params is part of url
  const { imageURL } = req.body; /* body is part of the request body itself

  ClothingItem.findByIdAndUpdate(itemId, {
    set: { imageURL },
  }) /* "set" is mongoosedb specific
    .orFail()
    .then(
      (item) =>
        res.status(200).send({ data: item }) /* sends item back as data
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message });
    });
}; */

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  /* const { _id: userId } = req.user; */
  console.log(itemId);
  ClothingItem.findOne({ _id: itemId })
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError(
          "Forbidden - you don't have permission to access this resource"
        );
      }
      return item
        .remove()
        .then(() => res.status(200).send({ message: "Item Deleted" }))
        .catch((err) => {
          console.error(err);
          next(new internalServerError(err.message));
        });
    })

    .catch((err) => {
      console.error(err);
      handleRepeatErrors(err, res, next);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ item }))

    .catch((err) => {
      console.error(err);
      handleRepeatErrors(err, res, next);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then(
      (item) => res.status(200).send({ item }) /* sends item back as data */
    )
    .catch((err) => {
      console.error(err);
      handleRepeatErrors(err, res, next);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
