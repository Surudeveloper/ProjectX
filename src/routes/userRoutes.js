import express from "express";
import { authController } from "../controllers/authController.js";
// import { AdminController } from "../controllers/adminController.js";

export let userRoutes = express.Router();

userRoutes.post("/Login", authController.Login);

userRoutes.post("/Create_User", authController.Create_User);

userRoutes.post("/Get_All_Users", authController.Get_All_Users);
// userRoutes.get("/Get_All_Users", authController.Get_All_Users);

userRoutes.post("/Update_User_Details", authController.Update_User_Details);

userRoutes.post("/Deactivate_User", authController.Deactivate_User);

userRoutes.post("/Activate_User", authController.Activate_User);

userRoutes.post("/Upload_User_logo", authController.Upload_User_logo);

userRoutes.post("/Upload_User_Background_logo", authController.Upload_User_Background_logo);
