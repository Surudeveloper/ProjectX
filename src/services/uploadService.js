import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import util from 'util';
import { fileURLToPath } from 'url';

const maxFileNo = 10
const inputFile = 'myfile'

// Manually define __dirname (since it's not available in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the public and uploads folder paths
const publicDirectoryPath = path.resolve(__dirname, '../public/files');

const app = express();

// Serve the src/public folder statically
app.use(express.static(publicDirectoryPath));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDirectoryPath);
  },
  filename: function (req, file, cb) {
    cb(null, uuid() + '-' + file.originalname);
  }
});

// Initialize Multer for handling single file uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 } 
});

export let UploadServices=()=>{}


UploadServices.Upload_Project_Docs = async (req, res, projectName) => {
  try {
    // const acceptedFiles = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xlsx','xls']
    const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    if (!fs.existsSync(path.join(publicDirectoryPath, 'projects')+`/${projectName.replace(/\s+/g, '')}`)) {
      fs.mkdirSync(path.join(publicDirectoryPath, 'projects')+`/${projectName.replace(/\s+/g, '')}`, { recursive: true });
    }

    const uploadPromise = util.promisify(multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(publicDirectoryPath, 'projects')+`/${projectName.replace(/\s+/g, '')}`);
        },
        filename: function (req, file, cb) {
          cb(null, projectName.replace(/\s+/g, '')+`-`+uuid() + '-' + file.originalname);
        }
      }),
      limits: { fileSize: 1048576 },
      // limits: { fileSize: 1000000 },
      fileFilter: (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
          cb(null, true); // Accept the file
        } else {
          cb(new Error('INVALID FILE TYPE. ONLY PDF, IMAGE, WORD, OR EXCEL FILES ARE ALLOWED.'), false); // Reject the file
        }
      }
    }).array( inputFile,maxFileNo));

    if (uploadPromise.length > maxFileNo) {
      return { success: false, msg: `YOU CAN UPLOAD A MAXIMUM OF ${maxFileNo} FILES` };
    }

    await uploadPromise(req, res);
    
    if (!req.files || req.files.length === 0) {
      return { success: false, msg: 'NO FILES SELECTED!' };
    }

    const filesInfo = req.files.map(file => {
      return { fileInfo: file, extn: path.extname(file.originalname)};
    });

    return { success: true, Data: filesInfo };

  } catch (err) {
    if(err.code = 'LIMIT_FILE_SIZE'){
      return { success: false, msg: 'FILE SIZE EXCEEDS THE LIMIT. MAXIMUM ALLOWED SIZE IS 1MB.' };
    }
    return { success: false, msg: err.message };
  }
};

UploadServices.Upload_User_logo = async (req, res, userId) => {
  try {
    // const acceptedFiles = ['jpg', 'jpeg', 'png']
    const allowedFileTypes = ['image/jpeg', 'image/png'];

    if (!fs.existsSync(path.join(publicDirectoryPath, 'Users'))) {
      fs.mkdirSync(path.join(publicDirectoryPath, 'Users'), { recursive: true });
    }

    const uploadPromise = util.promisify(multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(publicDirectoryPath, 'Users'));
        },
        filename: function (req, file, cb) {
          cb(null, uuid() + '-' + file.originalname);
        }
      }),
      limits: { fileSize: 1048576 },  //1MB
      fileFilter: (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
          cb(null, true); // Accept the file
        } else {
          cb(new Error(`INVALID FILE TYPE. ONLY IMAGE FILES (jpg, jpeg, png) ARE ALLOWED.`), false); // Reject the file
        }
      }
    }).array( inputFile,1));

    // if (uploadPromise.length > 1) {
    //   return { success: false, msg: `YOU CAN UPLOAD A MAXIMUM OF 1 FILES` };
    // }

    await uploadPromise(req, res);
    
    if (!req.files || req.files.length === 0) {
      return { success: false, msg: 'NO FILES SELECTED!' };
    }

    const filesInfo = req.files.map(file => {
      return { success: true, fileInfo: file, extn: path.extname(file.originalname)};
    });

    return { success: true, Data: filesInfo };

  } catch (err) {
    if(err.code = 'LIMIT_FILE_SIZE'){
      return { success: false, msg: 'FILE SIZE EXCEEDS THE LIMIT. MAXIMUM ALLOWED SIZE IS 1MB.' };
    }
    return { success: false, msg: err.message };
  }
};
