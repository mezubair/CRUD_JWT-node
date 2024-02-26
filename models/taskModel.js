const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    taskPriority: {
      type: String,
      enum: ["low", "medium", "high"], 
      default:"low"
    },
    dueDate:{type:Date,required:true},
    category:{type:String, default: "uncategorized"}
  },
  { timestamps: true },
  {versionkey:false}
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
