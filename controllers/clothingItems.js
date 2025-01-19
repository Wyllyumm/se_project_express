const ClothingItem = require("../models/clothingItem");
const { error400, error404, error500, error403 } = require("../utils/errors");
const ForbiddenError = require("../errors/forbiddenError");
const { handleRepeatErrors } = require("../middlewares/error-handler");

const createItem = (req, res) => {
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
      handleRepeatErrors(err, res, next);
      /*if (err.name === "ValidationError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message }); */
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);

      return res.status(error500.status).send({ message: error500.message });
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findOne({ _id: itemId })
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        /*return res.status(error403.status).send({ message: error403.message }); */
        throw new ForbiddenError(
          "Forbidden - you don't have permission to access this resource"
        );
      }
      return item
        .remove()
        .then(() => res.status(200).send({ message: "Item Deleted" }))
        .catch((err) => {
          console.error(err);
          return res
            .status(error500.status)
            .send({ message: error500.message });
        });
    })
    .catch((err) => {
      console.error(err);
      handleRepeatErrors(err, res, next);
      /*if (err.name === "CastError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message }); */
    });
};

const likeItem = (req, res) => {
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
      /*if (err.name === "CastError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message }); */
    });
};

const dislikeItem = (req, res) => {
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
      /*if (err.name === "CastError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message }); */
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
