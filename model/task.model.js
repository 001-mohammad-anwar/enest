import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    assignedTo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// COMPOUND INDEX
taskSchema.index({
  projectId: 1,
  status: 1,
});



// SEARCH INDEX
taskSchema.index({
  title: "text",
});

const Task = mongoose.model("Task", taskSchema);

export default Task;