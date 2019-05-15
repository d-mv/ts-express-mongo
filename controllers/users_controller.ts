
import * as User from '../models/user'

import { apiResponseTYPE, IncUserCreateTYPE } from '../src/types'
import { checkFields, dropQuotes } from '../modules/checkStrings'


export const checkToken = (token: string, callback: (arg0: apiResponseTYPE) => void) => {
  // check fields
  dropQuotes(token) === "" ? callback({ status: false, message: 'Unauthorised(no token)' }) : null
  // check with DB
  User.checkToken(token, (modelResponse: apiResponseTYPE) => {
    callback(modelResponse)
  })
}

export const create = (props: IncUserCreateTYPE, callback: (arg0: apiResponseTYPE) => void) => {
  // check fields
  let reply: apiResponseTYPE = checkFields({ query: props.query })
  // if negative reply immediately
  if (!reply.status) {
    callback(reply)
  } else {
    // assign value to avoid 'or empty' clause
    const user: any = props.query
    // request User model
    User.create(user, (modelResponse: apiResponseTYPE) => {
      callback(modelResponse)
    })
  }
}

export const get = (props: IncUserCreateTYPE, callback: (arg0: apiResponseTYPE) => void) => {
  // check auth
  checkToken(props.token || '', (r: apiResponseTYPE) => {
    !r.status ? callback(r) : null

    // check fields
    let reply: apiResponseTYPE = checkFields({ query: props.query })
    // if negative reply immediately
    !reply.status ? callback(reply) : null

    // assign value to avoid 'or empty' clause
    const user: any = props.query
    // request User model
    User.create(user, (modelResponse: apiResponseTYPE) => {
      callback(modelResponse)
    })
  })
}

