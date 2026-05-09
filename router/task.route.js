import express from "express";
import { createTask,deleteTask,getProjectTasks, updateTask } from "../controller/task.controller.js";
import { isAuthenticated } from "../middleware/auth-middleware.js";


const router = express.Router();



// CREATE TASK
router.post(
  "/create-task",
  isAuthenticated,
  createTask
);



// GET PROJECT TASKS
router.get(
  "/projects/:id/tasks",
  isAuthenticated,
  getProjectTasks
);



// UPDATE TASK
router.put(
  "/tasks/:id",
  isAuthenticated,
  updateTask
);



// DELETE TASK
router.delete(
  "/tasks/:id",
  isAuthenticated,
  deleteTask
);



export default router;