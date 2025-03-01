import mongoose from "mongoose";

var ProjectDocs = new mongoose.Schema(
  {
    Project_ID: { type: String, default: "" },
    Document_ID: { type: String, default: "" },
    Document_Name: { type: String, default: "" },
    Document_Type: { type: String, default: "" },
    Content_Type: { type: String, default: "" },
    Content_Size: { type: String, default: "" },
    Content_Originalname: { type: String, default: "" },
    Document_Asignee: { type: String, default: "" },
    Uploaded_By: { type: String, default: "" },
    Edited_By: { type: String, default: "" },
    Status: { type: String, default: 'Pending'},
    Content_Changes: [mongoose.Schema.Types.Mixed],
  },
  {
    collection: "ProjectDocs",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export var ProjectDocs = mongoose.model("ProjectDocs", ProjectDocs);

