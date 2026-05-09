import Project from "../model/project.model.js"
import Task from "../model/task.model.js"



//  CREATE PROJECT CONTROLLER

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
  
  
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }


    const project = await Project.create({
      name,
      description,
      user: req.userId,
    });



    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });

  } catch (error) {

    console.log("CREATE PROJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// GET ALL PROJECTS CONTROLLER

export const getAllProjects = async (req, res) => {
  try {
   
    // FIND USER PROJECTS
    const projects = await Project.find({
      user: req.userId,
    }).sort({ createdAt: -1 });


    // ADD TASK COUNT
    const projectsWithTaskCount = await Promise.all(
      projects.map(async (project) => {

        const totalTasks = await Task.countDocuments({
          projectId: project._id,
        });

        return {
          ...project._doc,
          totalTasks,
        };
      })
    );



    return res.status(200).json({
      success: true,
      totalProjects: projects.length,
      projects: projectsWithTaskCount,
    });

  } catch (error) {

    console.log("GET PROJECTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// ================= GET SINGLE PROJECT =================

export const getSingleProject = async (req, res) => {
  try {

    const { id } = req.params;



    // FIND PROJECT
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



    // GET PROJECT TASKS
    const tasks = await Task.find({
      projectId: id,
    }).sort({ createdAt: -1 });



    return res.status(200).json({
      success: true,
      project,
      tasks,
    });

  } catch (error) {

    console.log("GET SINGLE PROJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
 

// serch api

export const searchProjects = async (req, res) => {
  try {
    const { q } = req.query; // search keyword

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const projects = await Project.find({
      user: req.userId,
      name: { $regex: q, $options: "i" }, // case-insensitive search
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      projects,
    });

  } catch (error) {
    console.log("SEARCH PROJECT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ================= UPDATE PROJECT =================

export const updateProject = async (req, res) => {
  try {

    const { id } = req.params;

    const { name, description } = req.body;



    // FIND PROJECT
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



    // UPDATE DATA
    if (name) {
      project.name = name;
    }

    if (description) {
      project.description = description;
    }



    await project.save();



    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });

  } catch (error) {

    console.log("UPDATE PROJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// ================= DELETE PROJECT =================

export const deleteProject = async (req, res) => {
  try {

    const { id } = req.params;

   

    // FIND PROJECT
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



    // DELETE ALL TASKS RELATED TO PROJECT
    await Task.deleteMany({
      projectId: id,
    });



    // DELETE PROJECT
    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (error) {

    console.log("DELETE PROJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};