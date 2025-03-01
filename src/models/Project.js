import mongoose from "mongoose";

var Projects = new mongoose.Schema(
  {
    Project_ID: { type: String, default: "" },
    Project_Name: { type: String, default: "" },
    Assign_User: { type: String, default: "" },
    Status: { type: Boolean, default: true },
    Display_Timer: { type: Boolean, default: true },
    Assign_Task: { type: String, default: "Auto" },
    Documents: [mongoose.Schema.Types.Mixed],
  },
  {
    collection: "Projects",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export var Projects= mongoose.model("Projects", Projects);
