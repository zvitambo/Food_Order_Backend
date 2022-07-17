
import express from 'express';
import App from './services/ExpressApp';
import dbConnection from './services/Database';
const dotenv = require("dotenv");
dotenv.config();
import { PORT } from './config'; 

console.log("PORT - ", PORT);
const StartServer = async() => {

     const app = express();

     await dbConnection();
     
     await App(app);

     app.listen(PORT, () => {
       console.log(`Server started on port ${PORT}`);
     }); 
}


StartServer();











// import { MONGO_URI } from "./config";
// import express from "express";
// import mongoose from "mongoose";
// import { AdminRoute, VandorRoute } from "./routes";
// import bodyParser from "body-parser";
// import path from "path";

// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use("images", express.static(path.join(__dirname, "images")));

// app.use("/admin", AdminRoute);
// app.use("/vandor", VandorRoute);

// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("Connected to Mongo DB"))
//   .catch(() => console.log("Database connection failed"));

// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });