import assert from "assert";

import * as MDB from "../modules/db_connect";
import * as Generate from "../modules/token_gen";
import { dropQuotes } from "../modules/check_strings";
import {
  apiResponseTYPE,
  UserTYPE,
  NewUserTYPE,
  IncLoginTYPE
} from "../src/types";

const dbName = "newsletter";

// * Utilities
/**
 * Update user fields
 * @function updateUser
 * @param {string} id - User ID, found before (double check)
 * @param { object } newFields - New fields to update
 * @returns {} - Uses callback function to send apiResponseTYPE
 */
const updateUser = (
  id: string,
  newFields: { [index: string]: string | Date | number },
  callback: (arg0: apiResponseTYPE) => void
) => {
  MDB.client.connect(err => {
    assert.equal(null, err);
    const db: any = MDB.client.db(dbName);
    db.collection("v2")
      .updateOne(
        { _id: new MDB.ObjectID(id) },
        { $set: newFields },
        { upsert: true }
      )
      .then((document: any) => {
        // check if result is positive
        const check =
          document.result.nModified === 1 && document.result.ok === 1;
        if (check) {
          callback({ status: true, message: "Fields updated" });
        } else {
          callback({
            status: false,
            message: "Contact administrator (user fields update failed)"
          });
        }
      })
      .catch((e: any) =>
        callback({ status: false, message: `Contact administrator (${e})` })
      );
  });
};
// * enf-of-utilities
/**
 * Create user in the system and authenticate it
 * @function create
 * @param { object } user - User object as per { name: string, email: string, pass: string }
 * @returns {} - Uses callback function to send apiResponseTYPE
 */
export const create = (
  user: UserTYPE,
  callback: (arg0: apiResponseTYPE) => void
) => {
  const token = Generate.token();
  const createUser: NewUserTYPE = {
    name: dropQuotes(user.name),
    email: dropQuotes(user.email),
    pass: dropQuotes(user.pass),
    token: token,
    dateAuth: new Date()
  };

  MDB.client.connect(err => {
    assert.equal(null, err);

    const db: any = MDB.client.db(dbName);
    db.collection("v2")
      .insertOne({ user: createUser })
      .then((dbReply: any) => {
        if (dbReply.insertedCount === 1) {
          callback({
            status: true,
            message: "User created",
            payload: { token: token }
          });
          MDB.client.close();
        } else {
          callback({
            status: false,
            message: "User not created"
          });
          MDB.client.close();
        }
      })
      .catch((e: any) => console.log(e));
  });
};
/**
 * Check token for existence and validity, zero it in DB if not valid
 * @function checkToken
 * @param { string } token - User ID
 * @returns {} - Uses callback function to send apiResponseTYPE
 */
export const checkToken = (
  token: string,
  callback: (arg0: apiResponseTYPE) => void
) => {
  MDB.client.connect(err => {
    assert.equal(null, err);

    const db: any = MDB.client.db(dbName);
    db.collection("v2")
      .aggregate([
        {
          $match: {
            "user.token": token
          }
        }
      ])
      .toArray((err: any, result: any) => {
        // if error return error
        if (err) {
          callback({
            status: false,
            message: `Contact administrator (${err.toString()})`
          });
        }
        // if no token found
        else if (result.length === 0) {
          callback({
            status: false,
            message: `Unauthorized (token not found)`
          });
        } else {
          // if token found
          const dateAuth = result[0].user.dateAuth;
          const today: any = new Date();
          const authedHours = Math.round((today - dateAuth) / 3600000);
          // check time validity
          if (authedHours < 7 && authedHours >= 0) {
            // if valid
            callback({
              status: true,
              message: "Authorized",
              payload: { id: result[0]._id, name: result[0].user.name }
            });
          } else {
            // if not
            updateUser(
              result[0]._id,
              {
                "user.token": "",
                "user.dateAuth": ""
              },
              (updateUserResponse: apiResponseTYPE) => {
                let response: apiResponseTYPE = {
                  status: false,
                  message: "Unauthorized (token expired)"
                };
                if (authedHours < 0) {
                  response.message =
                    "Unauthorized (token expired, dateAuth in DB later than today)";
                }
                callback(response);
              }
            );
          }
        }
      });
  });
};
/**
 * Get user details by ID
 * @function get
 * @param { string } id - User ID
 * @returns {} - Uses callback function to send apiResponseTYPE
 */
export const get = (id: string, callback: (arg0: apiResponseTYPE) => void) => {
  MDB.client.connect(err => {
    assert.equal(null, err);
    const db: any = MDB.client.db(dbName);
    db.collection("v2")
      .findOne({ _id: new MDB.ObjectID(id) })
      .then((document: any) => {
        let response: apiResponseTYPE = {
          status: false,
          message: "User not found"
        };
        if (document) {
          response = {
            status: true,
            message: "User is found",
            payload: {
              name: document.user.name,
              email: document.user.email
            }
          };
        }
        callback(response);
      })
      .catch((e: any) => console.log(e));
  });
};
/**
 * Check if user exists of new
 * @function isUserNew
 * @param { string } user - User email
 * @returns {} - Uses callback function to send apiResponseTYPE
 */
const isUserNew = (
  email: string,
  callback: (arg0: apiResponseTYPE) => void
) => {
  MDB.client.connect(err => {
    assert.equal(null, err);
    const db: any = MDB.client.db(dbName);
    db.collection("v2")
      .aggregate([
        {
          $match: {
            "user.email": email
          }
        }
      ])
      .toArray((err: any, result: any) => {
        // no result
        let response: apiResponseTYPE = {
          status: false,
          message: "User not found (email is not registered)"
        };
        if (result.length > 1) {
          // if too many results
          response.message = "Contact administrator (too many results)";
        } else {
          // match
          response = {
            status: true,
            message: "User found",
            payload: { id: result[0]._id }
          };
        }
        callback(response);
      });
  });
};

/**
 * Try login user
 * @function loginAttempt
 * @param { object } user - User in format {email: string, pass: string}
 * @param {string} id - User ID, found before (double check)
 * @returns {} - Uses callback function to send apiResponseTYPE
 */
export const loginAttempt = (
  user: IncLoginTYPE,
  id: string,
  callback: (arg0: apiResponseTYPE) => void
) => {
  MDB.client.connect(err => {
    // assert.equal(null, err);
    const db: any = MDB.client.db(dbName);
    db.collection("v2")
      .aggregate([
        {
          $match: {
            _id: new MDB.ObjectID(id),
            "user.email": user.email,
            "user.pass": user.pass
          }
        }
      ])
      .toArray((err: any, result: any) => {
        let response: apiResponseTYPE = { status: false, message: "" };
        if (err) {
          callback({
            status: false,
            message: `Contact administrator (${err
              .toString()
              .replace(/\\"/g, "")})`
          });
        } else if (result.length === 1) {
          // match

          // set the fields to update
          const token = Generate.token();
          const newFields = {
            "user.token": token,
            "user.date": new Date()
          };
          // call updater
          updateUser(
            result[0]._id,
            newFields,
            (updateUserResponse: apiResponseTYPE) => {
              if (updateUserResponse.status) {
                response = {
                  status: true,
                  message: "User logged in",
                  payload: {
                    id: result[0]._id,
                    name: result[0].user.name,
                    token: token
                  }
                };
              } else {
                response = updateUserResponse;
              }
              callback(response);
            }
          );
        } else {
          if (result.length > 1) {
            // if too many results
            response.message =
              "Contact administrator (too many results, not possible at this point)";
          } else {
            // no result
            response.message = "User not found (not matching 3 keys)";
          }
          callback(response);
        }
      });
  });
};

/**
 * Login user
 * @function login
 * @param { object } user - User in format {email: string, pass: string}
 * @returns {} - Uses callback function to send apiResponseTYPE
 */
export const login = (
  user: IncLoginTYPE,
  callback: (arg0: apiResponseTYPE) => void
) => {
  isUserNew(user.email, (newUserResponse: apiResponseTYPE) => {
    // if 1 only user found, attempt to login
    if (newUserResponse.status) {
      loginAttempt(
        user,
        newUserResponse.payload.id,
        (loginAttemptResponse: apiResponseTYPE) => {
          callback(loginAttemptResponse);
        }
      );
    } else {
      callback(newUserResponse);
    }
  });
};
