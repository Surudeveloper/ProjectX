import mongoose from "mongoose";
import config from "./config.js";
let URL = config.Mongo_URL;

(async () => {
  try {
    await mongoose.connect(URL);
    console.log(`Database Connected Successfully`);
  } catch (err) {
    console.log({ Status: "false", Msg: err.message });
  }
})();

