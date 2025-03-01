import { v4 as uuid } from 'uuid';
import bcrypt from "bcryptjs"
//models
import { Users } from "../models/Users.js";

export let UserServices = () => { };


UserServices.Create_User = async (values) => {
    try {
        const { name, email, phone, role, Address, city, Pin, State, Country, Password } = values;
        let hashPassword = bcrypt.hashSync(Password, 8)
        let query = {
            userID: uuid(),
            name, email,
            phone, role,
            Address, city,
            Pin, State, Country, 
            Password: hashPassword+"|"+Password
        };
        await Users.create(query);
        return { status: true, msg: "NEW USER ADDED SUCCESSFULLY" };
    } catch (err) {
        return { status: false, msg: { Error: err.message, MethodErr: `UserServices/Create_User` } };
    }
};

UserServices.Get_All_Users = async () => {
    try {
        let query = {};
        let proj = { __v: 0 };
        let Result = await Users.find(query, proj).lean().exec();
        return { success: true, msg: { Data: Result } };
    } catch (err) {
        return { success: false, msg: { Error: err.message, MethodErr: `UserServices/Get_All_Users` } };
    }
};

UserServices.Get_User_Details = async (values) => {
    try {
        let query = { email: values.email, Password: values.Password };
        let proj = { __v: 0 };
        let Result = await Users.find(query, proj).lean().exec();
        if (Result.length > 0) {
            return { status: true, msg: Result };
        } else {
            return { status: false, msg: `INCORRECT EMAIL OR PASSWORD` };
        }
    } catch (err) {
        return { status: false, msg: { Error: err.message, MethodErr: `UserServices/Get_User_Details` } };
    }
};

UserServices.Change_Status = async (value, type) => {
    try {
        let query = { "userID": value };
        var updObj
        updObj = type == 1 ? { "Status": true } : { "Status": false }
        let Result = await Users.findOneAndUpdate(query, updObj).lean().exec();
        if (Result) {
            var msg = type == 1 ? `USER ACTIVATED` : `USER DEACTIVATED`
            return { status: true, msg };
        } else {
            return { status: false, msg: `INCORRECT EMAIL OR PASSWORD` };
        }
    } catch (err) {
        return { status: false, msg: { Error: err.message, MethodErr: `UserServices/Get_User_Details` } };
    }
};

// UserServices.Deactivate_User = async (value) => {
//     try {
//         let query = { "userID": value };
//         let updObj = { "Status": false };
//         let Result = await Users.findOneAndUpdate(query, updObj).lean().exec();
//         if (Result) {
//             return { status: true, msg: `USER DEACTIVATED` };
//         } else {
//             return { status: false, msg: `INCORRECT EMAIL OR PASSWORD` };
//         }
//     } catch (err) {
//         return { status: false, msg: { Error: err.message, MethodErr: `UserServices/Get_User_Details` } };
//     }
// };

UserServices.Activate_User = async (value) => {
    try {
        let query = { "userID": value };
        let updObj = { "Status": true };
        let Result = await Users.findOneAndUpdate(query, updObj).lean().exec();
        if (Result) {
            return { status: true, msg: `USER ACTIVATED` };
        } else {
            return { status: false, msg: `INCORRECT EMAIL OR PASSWORD` };
        }
    } catch (err) {
        return { status: false, msg: { Error: err.message, MethodErr: `UserServices/Get_User_Details` } };
    }
};

UserServices.save_User_logo = async (userId, Files, type) => {
    try {
        const docRecord = []
        let record = {};

        if (Files.length > 0) {
            if (type == 1) {
                record["UserLogo"] = Files[0]?.fileInfo?.filename;
            } else if (type == 2) {
                record["BackgroundLogo"] = Files[0]?.fileInfo?.filename;
            }

            let findQuery = { userID: userId };

            let updtData = { "$set": record };
            let newDoc = { new: true, returnNewDocument: true };

            let docRecord = await Users.findOneAndUpdate(findQuery, updtData, newDoc).lean().exec();
            return { success: true, msg: { Data: docRecord } };
        } else {
            return { success: false, msg: `NO FILE SELECTED` };
        }
    } catch (err) {
        return {
            success: false,
            msg: { Error: err.message, MethodErr: `UserServices/save_User_logo` }
        };
    }
};

// UserServices.save_User_Background_logo = async (userId, Files) => {
//     try {
//         const docRecord = []
//         let record = {};

//         if (Files.length > 0) {
//             record["BackgroundLogo"] = Files[0]?.fileInfo?.filename;

//             let findQuery = { userID: userId };

//             let updtData = { "$set": record };
//             let newDoc = { new: true, returnNewDocument: true };

//             let docRecord = await Users.findOneAndUpdate(findQuery, updtData, newDoc).lean().exec();
//             if(docRecord){
//                 return { success: true, msg:{ Data: docRecord }};
//             } else {
//                 return { success: true, msg:`Something went wrong while saving data`};
//             }
//         } else {
//             return { success: false, msg: `NO FILE SELECTED` };
//         }
//     } catch (err) {
//         return {
//             success: false,
//             msg: { Error: err.message, MethodErr: `UserServices/save_User_logo` }
//         };
//     }
// };

