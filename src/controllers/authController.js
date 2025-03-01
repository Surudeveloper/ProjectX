export let authController = () => { };

import { AdminController } from "./adminController.js";
import { UserServices } from "../services/userService.js";
import { UploadServices } from "../services/uploadService.js";
import config from "../config/config.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Middleware to authenticate and extract token
authController.authenticateToken = async (req, res, next) => {
    var token = req.headers['x-access-token']
    if (!token) {
        return res.status(401).json({ success: false, error: 'Access Denied, Token Missing!' });
    }

    // Verify the JWT token
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Invalid Token!' });
        }

        // If verified, store the decoded token data in the request
        req.user = decoded;
        console.log(req.user, '============requser');
        
        next();  // Proceed to the next middleware/route handler
    });
};

// Example route to get user details using the token
// authController.get('/user-details', authenticateToken, async (req, res) => {
//     try {
//       // Get userId from the decoded token (Assume `userId` is in the token payload)
//       const userId = req.user.id;

//       // Fetch user details from MongoDB using the userId
//       const user = await User.findById(userId).select('-password');  // Exclude password from the result

//       if (!user) {
//         return res.status(404).json({ error: 'User not found!' });
//       }

//       // Send user details as the response
//       res.json(user);

//     } catch (error) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

authController.Login = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        let Email = await AdminController.Is_Email_Exist(values)
        if (Email.status) {
            let Data = Email.msg.Data[0]
            const passIsValid = bcrypt.compareSync(values.Password, Data.Password)
            if (!passIsValid) {
                res.status(200).send({ auth: false, token: "Invalid Password" })
            } else {
                var token = jwt.sign({ id: Data._id }, config.secret, { expiresIn: 86400 })
                res.status(200).send({ auth: true, token: token })
            }
        } else {
            res.send({ auth: false, message: Email.msg });
        }
    } catch (err) {
        res.send({ auth: false, message: err.message });
    }
};

authController.Create_User = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        if (values.APIKEY != null && values.SessionID != null) {
            let Check_Session_N_API = await AdminController.Check_Session_N_API(values);
            if (Check_Session_N_API.status) {
                let Email = await AdminController.Is_Email_Exist(values)
                // let user = UserServices.Get_User_Details(values)
                if (!Email.status) {
                    let user = await UserServices.Create_User(values)
                    if (user.status) {
                        res.send({ success: true, message: user.msg });
                    } else {
                        res.send({ success: false, message: Email.msg });
                    }
                } else {
                    res.send({ success: false, message: Email.msg });
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

authController.Update_User_Details = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        if (values.APIKEY != null && values.SessionID != null) {
            let Check_Session_N_API = await AdminController.Check_Session_N_API(values);
            if (Check_Session_N_API.status) {
                let Email = await AdminController.Is_Email_Exist(values)
                // let user = UserServices.Get_User_Details(values)
                if (!Email.status) {
                    let user = await UserServices.Create_User(values)
                    if (user.status) {
                        res.send({ success: true, message: user.msg });
                    } else {
                        res.send({ success: false, message: Email.msg });
                    }
                } else {
                    res.send({ success: false, message: Email.msg });
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

authController.Authenticate_User = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        if (values.APIKEY != null && values.SessionID != null) {
            let Check_Session_N_API = await AdminController.Check_Session_N_API(values);
            if (Check_Session_N_API.status) {
                let user = await UserServices.Get_User_Details(values)
                if (user.status) {
                    res.send({ success: true, message: user.msg });
                } else {
                    res.send({ success: false, message: user.msg });
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

authController.Get_All_Users = async (req, res) => {
    try {
        // let values = JSON.parse(JSON.stringify(req.body));
        // if (values.APIKEY != null && values.SessionID != null) {
        //     let Check_Session_N_API = await AdminController.Check_Session_N_API(values);
        //     if (Check_Session_N_API.status) {
                let user = await UserServices.Get_All_Users()
                if (user.success) {
                    res.send({ success: true, message: user.msg });
                } else {
                    res.send({ success: false, message: user.msg });
                }
        //     } else {
        //         res.send({ success: false, message: Check_Session_N_API.msg });
        //     }
        // } else {
        //     res.send({ success: false, message: `ENTER ALL TAGS` });
        // }
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
};

authController.Deactivate_User = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        let userId = req.query.userID
        if (values.APIKEY != null && values.SessionID != null) {
            let Check_Session_N_API = await AdminController.Check_Session_N_API(values);
            if (Check_Session_N_API.status) {
                let user = await UserServices.Change_Status(userId, 2)
                if (user.status) {
                    res.send({ success: true, message: user.msg });
                } else {
                    res.send({ success: false, message: user.msg });
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

authController.Activate_User = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        let userId = req.query.userID
        if (values.APIKEY != null && values.SessionID != null) {
            let Check_Session_N_API = await AdminController.Check_Session_N_API(values);
            if (Check_Session_N_API.status) {
                let user = await UserServices.Change_Status(userId, 1)
                if (user.status) {
                    res.send({ success: true, message: user.msg });
                } else {
                    res.send({ success: false, message: user.msg });
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

authController.Upload_User_logo = async (req, res) => {
    try {
        let userId = req.query.userID

        let Upload = await UploadServices.Upload_User_logo(req, res, userId)
        if (Upload.success) {
            // save the data in db project
            let saveUserLogo = await UserServices.save_User_logo(userId, Upload?.Data, 1)
            if (saveUserLogo.success) {
                res.send({ success: true, message: saveUserLogo.msg })
            } else {
                res.send({ success: false, message: saveUserLogo.msg })
            }
        } else {
            res.send({ success: false, message: Upload.msg })
        }
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
};

authController.Upload_User_Background_logo = async (req, res) => {
    try {
        let userId = req.query.userID

        let Upload = await UploadServices.Upload_User_logo(req, res, userId)
        if (Upload.success) {
            // save the data in db project
            let saveUserLogo = await UserServices.save_User_logo(userId, Upload?.Data, 2)
            if (saveUserLogo.success) {
                res.send({ success: true, message: saveUserLogo.msg })
            } else {
                res.send({ success: false, message: saveUserLogo.msg })
            }
        } else {
            res.send({ success: false, message: Upload.msg })
        }


    } catch (err) {
        res.send({ success: false, message: err.message });
    }
};
