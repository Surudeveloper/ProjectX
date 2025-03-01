import config from "../config/config.js";
//models
import { Users } from "../models/Users.js";
export let AdminController = () => { };


AdminController.Check_Session_N_API = async (values) => {
  try {
    await AdminController.Check_SessionID(values)
    await AdminController.Check_API_Key(values)
    return { status: true };
  } catch (err) {
    return { status: false, msg: { Error: err.message, MethodErr: `AdminController/Check_Session_N_API` } };
  }
};

AdminController.Check_SessionID = async (values) => {
  try {
    if (values.SessionID !== config.SessionID) {
      return { status: false, msg: `INVALID SESSION ID` };
    } else {
      return { status: true };
    }
  } catch (err) {
    return { status: false, msg: { Error: err.message, MethodErr: `AdminController/Check_SessionID` } };
  }
};

AdminController.Check_API_Key = async (values) => {
  try {
    if (values.APIKEY !== config.APIKEY) {
      return { status: false, msg: `INVALID API KEY` };
    } else {
      return { status: true };
    }
  } catch (err) {
    return { status: false, msg: { Error: err.message, MethodErr: `AdminController/Check_API_Key` } };
  }
};

AdminController.Deactivate_User = (values) => {
  try {
    if (values.APIKEY !== config.APIKEY) {
      return { status: false, msg: `INVALID API KEY` };
    } else {
      return { status: true };
    }
  } catch (err) {
    return { status: false, msg: { Error: err.message, MethodErr: `AdminController/Check_API_Key` } };
  }
};

AdminController.Is_Email_Exist = async (values) => {
  try {
    let query = { email: values.email };
    let proj = { __v: 0 };
    let Result = await Users.find(query, proj).lean().exec();
    if (Result.length > 0) {
      return { status: true, msg: { message: `EMAIL EXISTS`, Data: Result } };
    } else {
      return { status: false, msg: `NEW EMAIL` };
    }
  } catch (err) {
    return { status: false, msg: { Error: err.message, MethodErr: `UserServices/Get_User_Details` } };
  }
};