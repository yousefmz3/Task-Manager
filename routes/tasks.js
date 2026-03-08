const express = require("express");
const router = express.Router();
const {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getItem,
} = require("../controllers/tasks");

router.route("/").get(getItems).post(createItem);
router.route("/:id").get(getItem).patch(updateItem).delete(deleteItem);

module.exports = router;
