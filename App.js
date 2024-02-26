const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cron=require("node-cron");
const User = require("./models/userModel");
const Task=require("./models/taskModel")

const sendNotification = require("./utils/sendNotification");


const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/newCRUD", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });



  //SEND NOTIFCATION

  async function notificationSend() {
    try {
      const tasks = await Task.find({ dueDate: { $lt: new Date(Date.now() + 30 * 60 * 1000) } });
      const users = await User.find({ _id: { $in: tasks.map(task => task.userId) } });
  
      for (const user of users) {
        sendNotification({
          email: user.email,
          message: "Dear user, your task's due date is within 30 minutes."
        });
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  }
  cron.schedule('0 0 * * *', () => {
    console.log('Running notification task...');
    notificationSend();
  });



app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
