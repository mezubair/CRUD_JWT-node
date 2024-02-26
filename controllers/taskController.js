const Task = require("../models/taskModel");
const authMiddleware = require("../middleware/authMiddleware");

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, category, taskPriority } = req.body;
    const task = await Task.create({
      userId: req.user.userId,
      title,
      description,
      dueDate,
      taskPriority,
      category,
    });
    res.status(201).json({
      message: "task created Succesfully !",
        title: task.title,
        description: task.description
      });
} catch (error) {
  res.status(400).json({ message: error.message });
}
};

exports.getTasks = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const tasks = await Task.find();
      (tasks > 0 ? res.json({ tasks }) : res.json({ message: " No tasks found" }))

    } else {
      tasks = await Task.find({ userId: req.user.userId }).select('title description dueDate taskPriority completed');
      (tasks.length > 0 ? res.json(tasks) : res.json({ message: " No tasks found" }))
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTasksDueDate = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const tasks = await Task.find().sort({ dueDate: 1 });
      res.json({ tasks });
    } else {
      const tasks = await Task.find({ userId: req.user.userId }).sort({
        dueDate: 1,
      });
      res
        .status(200)
        .json({ message: "Tasks sorted according to due date", tasks });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTaskspriority = async (req, res) => {
  try {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    let tasks = await Task.find();

    tasks = tasks.sort((taskA, taskB) => {
      return (
        priorityOrder[taskA.taskPriority] - priorityOrder[taskB.taskPriority]
      );
    });

    if (req.user.role !== "admin") {
      tasks = tasks.filter((task) => task.userId === req.user.userId);
    }

    res.json({ message: "Tasks sorted according to priority", tasks });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




exports.getTask = async (req, res) => {
  console.log("🚀 ~ exports.getTask= ~ req:", req.user.userId);
  console.log("🚀 ~ exports.getTask= ~ req.params.id:", req.params.id)

  try {
    if (req.user.role === "admin") {
      const task = await Task.findOne({ _id: req.params.id });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ task });
    } else {
      const task = await Task.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ task });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const { title, description, completed,dueDate,taskPriority,category } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, description, completed,dueDate,taskPriority,category },
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

exports.getTasksCategory = async (req, res) => {
  const category = req.params.categoryName;
  try {
    const tasks = await Task.find({ category: category });
    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for this category" });
    }
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const deletedTask = await Task.findOneAndDelete({
        _id: req.params.id,
      });
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    }

    else {
      const deletedTask = await Task.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId,
      });
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
