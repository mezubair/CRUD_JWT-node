const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware.authenticateToken);

router.post("/", taskController.createTask);
router.get("/", taskController.getTasks);
router.get("/dueDate", taskController.getTasksDueDate);
router.get("/onPriorty", taskController.getTaskspriority);
router.get("/category/:categoryName", taskController.getTasksCategory);
router.get("/:id", taskController.getTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
