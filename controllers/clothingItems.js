const ClothingItem = require("../models/clothingItem");
const { error400, error404, error500 } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.user._id);

  const { name, weather, imageURL } = req.body;
  ClothingItem.create({ name, weather, imageURL, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.err(err);
      if (err.name === "ValidationError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.err(err);
      if (err.name === "ValidationError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message });
    });
};

const updateItemImage = (req, res) => {
  const { itemId } = req.params; /*params is part of url*/
  const { imageURL } = req.body; /*body is part of the request body itself*/

  ClothingItem.findByIdAndUpdate(itemId, {
    set: { imageURL },
  }) /*"set" is mongoosedb specific*/
    .orFail()
    .then(
      (item) => res.status(200).send({ data: item }) /*sends item back as data*/
    )
    .catch((err) => {
      console.err(err);
      if (err.name === "ValidationError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((err) => {
      console.err(err);
      if (err.name === "ValidationError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.err(err);
      if (err.name === "ValidationError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message });
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
      (item) => res.status(200).send({ data: item }) /*sends item back as data*/
    )
    .catch((err) => {
      console.err(err);
      if (err.name === "ValidationError") {
        return res.status(error400.status).send({ message: error400.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404.status).send({ message: error404.message });
      }
      return res.status(error500.status).send({ message: error500.message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItemImage,
  deleteItem,
  likeItem,
  dislikeItem,
};