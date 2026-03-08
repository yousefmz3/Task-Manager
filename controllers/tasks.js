const Task = require("../models/Task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

const getItems = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

const createItem = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

const getItem = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });
  if (!task) {
    throw createCustomError(`No task with id ${taskID}`, 404);
  }
  res.status(200).json({ task });
});

const updateItem = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!task) {
    throw createCustomError(`No task with id ${taskID}`, 404);
  }
  res.status(200).json({ task });
});

const deleteItem = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    throw createCustomError(`No task with id ${taskID}`, 404);
  }
  res.status(200).json({ task });
});

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getItem,
};
