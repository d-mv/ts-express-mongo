import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongodb from 'mongodb';
import assert from 'assert';

// const logger = require("morgan");
// const mongoose = require("mongoose");
// const db = mongoose.connection;

import dotenv from 'dotenv';
import compression from 'compression';

// routes
import router from '../routes/';
import userRouter from '../routes/user_router';

const dotEnv = dotenv.config();
const app = express();

app.use(compression());
// app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/', router);

// set up db
// Connection URL
const defaultUrl = 'mongodb://localhost:27017';
const connectUrl = `${process.env.MONGO_URL || defaultUrl}?retryWrites=true`;
// Database Name
const dbName = 'newsletter';
// Create a new MongoClient
const MongoClient = mongodb.MongoClient;
const client = new MongoClient(connectUrl, { useNewUrlParser: true });
// Use connect method to connect to the Server
const connect = client.connect(err => {
  assert.equal(null, err);
  console.log('Connected successfully to DB server');

  const db = client.db(dbName);

  client.close();
});

export default app;
