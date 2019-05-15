import * as User from "../models/user_model";

import {
  apiResponseTYPE,
  IncUserCreateTYPE,
  IncUserIdTYPE
} from "../src/types";

import {
  checkFields,
  checkFieldsLogin,
  dropQuotes,
  checkID,
  checkTokenLength
} from "../modules/check_strings";

// * done
/**
 * @param  {string} token
 * @param  {(arg0:apiResponseTYPE)=>void} callback
 */
export const checkToken = (
  token: string,
  callback: (arg0: apiResponseTYPE) => void
) => {
  // check fields
  dropQuotes(token) === ""
    ? callback({ status: false, message: "Unauthorized (no token)" })
    : null;
  // check if token malformed
  const checkLength = checkTokenLength(token);
  if (!checkLength.status) {
    callback(checkLength);
  } else {
    // check with DB
    User.checkToken(token, (modelResponse: apiResponseTYPE) => {
      callback(modelResponse);
    });
  }
};
/**
 * @param  {IncUserCreateTYPE} props
 * @param  {(arg0:apiResponseTYPE)=>void} callback
 */
export const create = (
  props: IncUserCreateTYPE,
  callback: (arg0: apiResponseTYPE) => void
) => {
  // check fields
  let reply: apiResponseTYPE = checkFields({ query: props.query });
  // if negative reply immediately
  if (!reply.status) {
    callback(reply);
  } else {
    // assign value to avoid 'or empty' clause
    const user: any = props.query;
    // request User model
    User.create(user, (modelResponse: apiResponseTYPE) => {
      callback(modelResponse);
    });
  }
};
/**
 * @param  {IncUserIdTYPE} props
 * @param  {(arg0:apiResponseTYPE)=>void} callback
 */
export const get = (
  props: IncUserIdTYPE,
  callback: (arg0: apiResponseTYPE) => void
) => {
  // check auth
  checkToken(props.token, (r: apiResponseTYPE) => {
    if (!r.status) {
      callback(r);
    } else {
      // check if ID is malformed
      const idCheckResult = checkID(props.id);
      if (idCheckResult.status) {
        // request User model
        User.get(props.id, (modelResponse: apiResponseTYPE) => {
          callback(modelResponse);
        });
      } else {
        callback(idCheckResult);
      }
    }
  });
};
/**
 * @param  {string} token
 * @param  {(arg0:apiResponseTYPE)=>void} callback
 */
export const check = (
  token: string,
  callback: (arg0: apiResponseTYPE) => void
) => {
  // check auth
  checkToken(token, (r: apiResponseTYPE) => {
    callback(r);
  });
};

// * end-of-done

/**
 * @param  {{query:{[index:string]:string}}} props
 * @param  {string} token
 * @param  {(arg0:apiResponseTYPE)=>void} callback
 */
export const login = (
  props: { query: { [index: string]: string }; token: string },
  callback: (arg0: apiResponseTYPE) => void
) => {
  // check fields
  let reply: apiResponseTYPE = checkFieldsLogin({ query: props.query });
  // if negative reply immediately
  if (!reply.status) {
    callback(reply);
  } else {
    // assign value to avoid 'or empty' clause
    const user: any = props.query;
    // request User model
    User.login(user, (modelResponse: apiResponseTYPE) => {
      callback(modelResponse);
    });
  }
};
