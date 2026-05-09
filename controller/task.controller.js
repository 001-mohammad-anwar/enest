import Task from "../model/task.model.js";
import Project from "../model/project.model.js";

// ================= CREATE TASK =================

export const createTask = async (req, res) => {
  try {
    const { projectId, title, description, assignedTo } = req.body;


    if (!projectId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "ProjectId, title and description are required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.user.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      assignedTo,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.log("CREATE TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET PROJECT TASKS =================

export const getProjectTasks = async (req, res) => {
  try {
    const { id } = req.params;

    // CHECK PROJECT EXISTS
    const project = await Project.findOne({
      _id: id,
      user: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // SEARCH & FILTER
    const { search, status } = req.query;

    let query = {
      projectId: id,
    };

    // FILTER BY STATUS
    if (status && status !== "all") {
      query.status = status;
    }

    // SEARCH BY TITLE
    if (search) {
      query.$text = {
        $search: search,
      };
    }

    // GET TASKS
    const tasks = await Task.find(query).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      totalTasks: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("GET TASKS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= UPDATE TASK =================

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, status, assignedTo } = req.body;

    // FIND TASK
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // CHECK PROJECT OWNERSHIP
    const project = await Project.findOne({
      _id: task.projectId,
      user: req.user.userId,
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // UPDATE FIELDS
    if (title) {
      task.title = title;
    }

    if (description) {
      task.description = description;
    }

    if (status) {
      task.status = status;
    }

    if (assignedTo !== undefined) {
      task.assignedTo = assignedTo;
    }

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.log("UPDATE TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= DELETE TASK =================

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // FIND TASK
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // CHECK PROJECT OWNERSHIP
    const project = await Project.findOne({
      _id: task.projectId,
      user: req.user.userId,
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // DELETE TASK
    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log("DELETE TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
