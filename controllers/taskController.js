const Task = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({
      userId: req.user.userId,
      title,
      description,
    });
    res.status(201).json({ task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json({ tasks });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, description, completed },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ task: updatedTask });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
