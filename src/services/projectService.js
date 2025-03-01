import { v4 as uuid } from 'uuid';

//models
import { Projects } from "../models/Project.js";
import { ProjectDocs } from "../models/ProjectDocuments.js";

export let ProjectServices = () => { };


ProjectServices.Check_Project_ID = async (values) => {
  try {
    let query = { Project_Name: values.Project_Name };
    let result = await Projects.findOne(query).lean().exec();
    if (result !== null) {
      return { status: false, msg: "PROJECT NAME ALREADY EXIST" };
    } else {
      return { status: true };
    }
  } catch (err) {
    return { success: false, msg: { Error: err.message, MethodErr: `ProjectServices/Check_Project_ID` } };
  }
};

ProjectServices.Create_New_Project = async (values) => {
  try {
    let query = {
      Project_ID: uuid(),
      Project_Name: values.Project_Name,
      Assign_User: values.Assign_User,
    };
    await Projects.create(query);
    return { success: true, msg: "NEW PROJECT CREATED SUCCESSFULLY" };
  } catch (err) {
    return { success: false, msg: { Error: err.message, MethodErr: `ProjectServices/Create_New_Project` } };
  }
};

ProjectServices.Get_All_Projects = async () => {
  try {
    // let query = {};
    // let proj = { __v: 0 };
    // let proj = { Project_ID:1, Project_Name:1, Assign_User:1, Status:1, Documents:1, Display_Timer:1, Doc_Count: { $size: "$Documents" } };
    // let Result = await Projects.find(query, proj).lean().exec();
    let Result = await Projects.aggregate([{ $addFields: { doc_Count: { $size: "$Documents" } } }]);
    return { success: true, Data: Result };
  } catch (err) {
    return { success: false, msg: { Error: err.message, MethodErr: `ProjectServices/Get_All_Projects` } };
  }
};

ProjectServices.Get_All_Users_Projects = async () => {
  try {
    let Result = await Projects.aggregate([{ $match: { Status: true } }, { $addFields: { doc_Count: { $size: "$Documents" } } }]);
    return { success: true, Data: Result };
  } catch (err) {
    return { success: false, msg: { Error: err.message, MethodErr: `ProjectServices/Get_All_Users_Projects` } };
  }
};

ProjectServices.get_Project_Info = async (projectID) => {
  try {
    let query = { Project_ID: projectID };
    let proj = { __v: 0 };
    let Result = await Projects.find(query, proj).lean().exec();
    if (Result?.length > 0) {
      return { success: true, Data: Result };
    } else {
      return { success: false, msg: `INVALID PROJECT ID` };
    }
  } catch (err) {
    return { success: false, msg: { Error: err.message, MethodErr: `ProjectServices/get_Project_Info` } };
  }
};

ProjectServices.save_Project_Doc = async (ProjectInfo, Files) => {
  try {
    const { Project_ID } = ProjectInfo;
    const docRecord = []

    if (Files.length > 0) {
      for (const el of Files) {
        try {
          const { originalname, filename, size } = el.fileInfo;
          const extn = el.extn;

          let findQuery = { Project_ID: Project_ID };
          let record = {};

          let Doc_ID = uuid();
          record["DocID"] = Doc_ID;
          record["Doc_Name"] = filename;
          record["created_Date"] = new Date();
          record["updated_Date"] = new Date();

          docRecord.push(record)

          let updtData = { "$push": { "Documents": record } };
          let newDoc = { new: true, returnNewDocument: true };

          await Projects.findOneAndUpdate(findQuery, updtData, newDoc).exec();
        } catch (error) {
          return { success: false, msg: { Error: error.message, MethodErr: `ProjectServices/save_Project_Doc/for...of` } };
        }
      }
      return { success: true, Data: docRecord };
    } else {
      return { success: false, msg: `NO FILE SELECTED` };
    }
  } catch (err) {
    return {
      success: false,
      msg: { Error: err.message, MethodErr: `ProjectServices/save_Project_Doc` }
    };
  }
};

ProjectServices.save_Document = async (ProjectInfo, Files, docRecord) => {
  try {
    const { Project_ID, Project_Name, Assign_User } = ProjectInfo;

    if (Files.length > 0) {
      for (const el of Files) {
        try {
          const { originalname, filename, size, mimetype } = el.fileInfo;
          const extn = el.extn;

          let Doc = docRecord.filter((el) => el.Doc_Name === filename)

          let query = {
            Project_ID: Project_ID,
            Document_ID: Doc[0].DocID,
            Document_Name: filename,
            Document_Type: extn.split('.')[1],
            Content_Type: mimetype,
            Content_Size: size,
            Content_Originalname: originalname,
            Document_Asignee: Assign_User,
            Uploaded_By: 'Admin',
            Edited_By: '',
            Status: 'Pending',
          };
          await ProjectDocs.create(query);
        } catch (error) {
          return { success: false, msg: { Error: error.message, MethodErr: `ProjectServices/save_Project_Doc/for...of` } };
        }
      }
      return { success: true, msg: `DOCUMENTS SAVED SUCCESSFULLY` };
    } else {
      return { success: false, msg: `NO FILE SELECTED` };
    }
  } catch (err) {
    return { success: false, msg: { Error: err.message, MethodErr: `ProjectServices/save_Document` } };
  }
};

ProjectServices.list_Projects_All_Documents = async (ProjectInfo) => {
  try {
    const { Project_ID } = ProjectInfo
    let query = { Project_ID: Project_ID };
    let proj = { __v: 0 };
    let Result = await ProjectDocs.find(query, proj).lean().exec();
    return { success: true, Data: Result };
  } catch (err) {
    return { success: false, msg: { Error: err.message, MethodErr: `ProjectServices/list_Projects_All_Documents` } };
  }
};

ProjectServices.Update_Project = async (values) => {
  try {
    const { Project_ID, Project_Name, Assign_User, Status, Display_Timer, Assign_Task } = values

    let findQuery = { Project_ID: Project_ID };
    let record = {};

    if (Status != null) {
      record["Status"] = Status;

    } else if (Display_Timer != null) {
      record["Display_Timer"] = Display_Timer;

    } else if (Assign_Task != null) {
      record["Assign_Task"] = Assign_Task;

    } else if (Project_Name != null && Assign_User != null) {
      record["Project_Name"] = Project_Name;
      record["Assign_User"] = Assign_User;

    } else {
      return { success: true, msg: "ENTER VALID DATA TO UPDATE" };
    }

    let updtData = { "$set": record };
    let newDoc = { new: true, returnNewDocument: true };

    let Update = await Projects.findOneAndUpdate(findQuery, updtData, newDoc).exec();

    return { success: true, msg: { msg: "PROJECT UPDATED SUCCESSFULLY", Data: Update._doc } };
  } catch (err) {
    return { success: false, msg: { Error: err.message, MethodErr: `ProjectServices/Create_New_Project` } };
  }
};

