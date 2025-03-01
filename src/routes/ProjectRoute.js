import express from "express";
import { commonController } from "../controllers/commonController.js";

export let projectRoute = express.Router();

projectRoute.post("/Create_Project", commonController.Create_Project);

projectRoute.post("/Get_All_Projects", commonController.Get_All_Projects);

projectRoute.post("/Get_All_Users_Projects", commonController.Get_All_Users_Projects);

projectRoute.post('/Upload_Project_Document', commonController.Upload_Project_Document)

projectRoute.get('/list_Projects_All_Documents', commonController.list_Projects_All_Documents)

projectRoute.post('/Update_Project', commonController.Update_Project)
