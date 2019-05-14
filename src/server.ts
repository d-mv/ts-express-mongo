import createError from "http-errors";
import express  from "express"
import cors  from "cors"
import path from "path"
import cookieParser from "cookie-parser"
import mongo from "mongodb"

// const logger = require("morgan");
// const mongoose = require("mongoose");
// const db = mongoose.connection;

import dotenv from "dotenv"
import compression from "compression"
import router from "../routes/"

// routes


const dotEnv = dotenv.config()
const app = express();

app.use(compression());
// app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", router);

export default app