export let commonController = () => { };

import { AdminController } from "./adminController.js";
import { ProjectServices } from "../services/projectService.js";
import { UploadServices } from "../services/uploadService.js";


commonController.Create_Project = async (req, res) => {
  try {
    let values = JSON.parse(JSON.stringify(req.body));
    if (values.APIKEY != null && values.SessionID != null && values.Project_Name != null && values.Assign_User != null) {
      let Check_Session_N_API = await AdminController.Check_Session_N_API(values);
      if (Check_Session_N_API.status) {
        let checkProjectExist = await ProjectServices.Check_Project_ID(values);
        if (checkProjectExist.status) {
          let newProject = await ProjectServices.Create_New_Project(values, res);
          var success = newProject.success ? true : false
          res.send({ success, message: newProject.msg });
        } else {
          res.send({ success: false, message: checkProjectExist.msg });
        }
      } else {
        res.send({ success: false, message: Check_Session_N_API.msg });
      }
    } else {
      res.send({ success: false, message: `ENTER ALL TAGS` });
    }
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

commonController.Get_All_Projects = async (req, res) => {
  try {
    let values = JSON.parse(JSON.stringify(req.body));
    if (values.APIKEY != null && values.SessionID != null) {
      let Check_Session_N_API = await AdminController.Check_Session_N_API(values);
      if (Check_Session_N_API.status) {
        let Result = await ProjectServices.Get_All_Projects();
        if (Result.success) {
          res.send({ success: true, Data: Result.Data });
        } else {
          res.send({ success: false, message: Result.msg });
        }
      } else {
        res.send({ success: false, message: Check_Session_N_API.msg });
      }
    } else {
      res.send({ success: false, message: `Enter All TAGS` });
    }
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

commonController.Get_All_Users_Projects = async (req, res) => {
  try {
    let values = JSON.parse(JSON.stringify(req.body));
    if (values.APIKEY != null && values.SessionID != null) {
      let Check_Session_N_API = await AdminController.Check_Session_N_API(values);
      if (Check_Session_N_API.status) {
        let Result = await ProjectServices.Get_All_Users_Projects();
        if (Result.success) {
          res.send({ success: true, Data: Result.Data });
        } else {
          res.send({ success: false, message: Result.msg });
        }
      } else {
        res.send({ success: false, message: Check_Session_N_API.msg });
      }
    } else {
      res.send({ success: false, message: `Enter All TAGS` });
    }
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

commonController.Upload_Project_Document = async (req, res) => {
  try {
    let projectID = req.query.projectID
    let ProjectInfo = await ProjectServices.get_Project_Info(projectID, res);
    if (ProjectInfo.success) {
      let Upload = await UploadServices.Upload_Project_Docs(req, res, ProjectInfo?.Data[0]?.Project_Name)
      if (Upload.success) {
        // save the data in db project
        let saveProjDoc = await ProjectServices.save_Project_Doc(ProjectInfo?.Data[0], Upload?.Data)
        if (saveProjDoc.success) {
          // save the full data in db projectDocuments
          let saveDocument = await ProjectServices.save_Document(ProjectInfo?.Data[0], Upload?.Data, saveProjDoc?.Data)

          res.send({ success: true, message: saveDocument.msg })
        } else {
          res.send({ success: false, message: saveProjDoc.msg })
        }
      } else {
        res.send({ success: false, message: Upload.msg })
      }
    } else {
      res.send({ success: false, message: ProjectInfo.msg });
    }
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

commonController.list_Projects_All_Documents = async (req, res) => {
  try {
    // let projectName= req.query.projectname
    let ProjectID = req.query.projectID
    let ProjectInfo = await ProjectServices.get_Project_Info(ProjectID, res);
    if (ProjectInfo.success) {
      let Project = ProjectInfo.Data[0]
      let DocData = await ProjectServices.list_Projects_All_Documents(Project)
      if (DocData.success) {
        res.send({ success: true, Data: DocData.Data })
      } else {
        res.send({ success: false, message: DocData.msg })
      }
    } else {
      res.send({ success: false, message: ProjectInfo.msg });
    }
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

commonController.Update_Project = async (req, res) => {
  try {
    let values = JSON.parse(JSON.stringify(req.body));
    if (values.APIKEY != null && values.SessionID != null && values.Project_ID != null) {
      let Check_Session_N_API = await AdminController.Check_Session_N_API(values);
      if (Check_Session_N_API.status) {

        let Project = await ProjectServices.Update_Project(values);
        // if (Project.success) {
        //   res.send({ success: true, message: Project.msg });
        // } else {
        //   res.send({ success: false, message: Project.msg });
        // }
        var success = Project.success ? true : false
        res.send({ success, message: Project.msg });
      } else {
        res.send({ success: false, message: Check_Session_N_API.msg });
      }

    } else {
      res.send({ success: false, message: `ENTER ALL TAGS` });
    }
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};