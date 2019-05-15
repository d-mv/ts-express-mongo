import mongodb from 'mongodb'
import assert from 'assert'
import dotenv from "dotenv"

import { apiResponseTYPE, UserTYPE } from '../src/types'

import { dropQuotes } from '../modules/checkStrings'

const dotEnv = dotenv.config()

// set up db
const MongoClient = mongodb.MongoClient
const connectUrl = `${process.env.MONGO_URL || 'mongodb://localhost:27017'}?retryWrites=true`
const dbName = 'newsletter';
const client = new MongoClient(connectUrl, { useNewUrlParser: true });

// Use connect method to connect to the Server
export const create = (user: UserTYPE, callback: (arg0: apiResponseTYPE) => void) => {

  const createUser: UserTYPE = { name: dropQuotes(user.name), email: dropQuotes(user.email), pass: dropQuotes(user.pass) }

  client.connect(err => {

    assert.equal(null, err);

    const db: any = client.db(dbName);

    db.collection('v2').insertOne({ user: createUser }).then((dbReply: any) => {

      client.close();

      if (dbReply.insertedCount === 1) {
        callback({
          status: true,
          message: 'User created',
          payload: { id: dbReply.insertedId }
        })
      } else {
        callback({
          status: false,
          message: 'User not created'
        })
      }
    }).catch((e: any) => console.log(e)
    );
  });
}

export const checkToken = (token: string, callback: (arg0: apiResponseTYPE) => void) => {
  client.connect(err => {
    assert.equal(null, err);

    const db: any = client.db(dbName);
    db.collection('v2').aggregate([{
      $match: {
        "auth.token": token
      }
    }
    ]).toArray((err: any, result: any) => {
      let message;
      err ? message = { status: false, message: err.toString() } : null
      if (result.length === 0) {
        message = { status: false, message: `Unauthorised(not found)` }
      } else {
        message = { status: true, message: 'Authorised', payload: {id: result[0]._id} }
      }
      callback(message)
    })
  })
}

