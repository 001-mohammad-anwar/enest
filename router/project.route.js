import express from "express";

import {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  searchProjects,
} from "../controller/project.controller.js";

import { isAuthenticated } from "../middleware/auth-middleware.js";

const router = express.Router();



// CREATE PROJECT
router.post("/createProject", isAuthenticated, createProject);



// GET ALL PROJECTS
router.get("/getAllproject", isAuthenticated, getAllProjects);



// GET SINGLE PROJECT
router.get("/getSingleProject/:id", isAuthenticated, getSingleProject);



// UPDATE PROJECT
router.put("/updateProject/:id", isAuthenticated, updateProject);



// DELETE PROJECT
router.delete("/deleteProject/:id", isAuthenticated, deleteProject);

router.get(
  "/search-projects",
  isAuthenticated,
  searchProjects
);



export default router;