import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import config from "./src/config/config.js";
import {} from "./src/config/database.js";
import { projectRoute } from "./src/routes/ProjectRoute.js";
import { userRoutes } from "./src/routes/userRoutes.js";
import { authController } from "./src/controllers/authController.js";
dotenv.config()

// let port = config.PORT;
// let port = process.env.PORT;

let port = process.env.PORT || 8090;
let app = express();
app.use(express.json()); 
app.use(cors())

// app.use(authController.authenticateToken)
// app.use("/project", authController.authenticateToken, projectRoute);
// app.use("/user", authController.authenticateToken, userRoutes);
app.use("/project", projectRoute);
app.use("/user", userRoutes);


app.listen(port, (err) => {
  if (err) throw err
  console.log(`App is listening to Port ${port}`);
});
