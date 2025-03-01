// let mongoose = require("mongoose");
import mongoose from "mongoose";

var Users = new mongoose.Schema({
  userID: { type: String, default: "" },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  Password: { type: String, default: "" },
  phone: { type: Number },
  role: { type: String, default: "User" },
  manager: { type: String, default: "" },
  Address: { type: String, default: "" },
  city: { type: String, default: "" },
  Pin: { type: Number, default: "" },
  State: { type: String, default: "" },
  Country: { type: String, default: "" },
  UserLogo: { type: String, default: "" },
  BackgroundLogo: { type: String, default: "" },
  Status: { type: Boolean, default: true },
}, { collection: "Users", timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, });

// module.exports = mongoose.model("Users", Users);
export var Users= mongoose.model("Users", Users);
