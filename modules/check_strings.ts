import { apiResponseTYPE, UserTYPE } from '../src/types'

/**
 * Drop single/double quote marks
 * @function dropQuotes
 * @param {string} text - Text to check
 * @returns {boolean}
 */
export const dropQuotes = (text: string): string => {
  const newLine = text.replace(/"|'/g, "")
  return newLine
}
/**
 * Check if string is empty
 * @function stringIsEmpty
 * @param {string} field - String of the field to check
 * @returns {boolean}
 */
const stringIsEmpty = (field: string): boolean => {
  const response = field === '' || field === "" || field === "''" ? false : true
  return response
}

/**
 * Check if fields are empty
 * @function fieldsCheck
 * @param {object} fields - Fields with/without values
 * @returns {object} - {  status: boolean, message: string}
 */
const fieldsCheckIfEmpty = (fields: { [index: string]: string }, scoreMax: number = 3): apiResponseTYPE => {
  let response: apiResponseTYPE;
  let score = 0

  Object.keys(fields).map((field: any) => {
    stringIsEmpty(fields[`${field}`]) ? score += 1 : null
  })
  if (score === 0) { response = { status: false, message: 'The request is empty' } }
  else if (score < scoreMax) { response = { status: false, message: 'The request is incomplete' } }
  else { response = { status: true, message: '' } }
  return response;
}

/**
 * Check the fields of query
 * @function checkFields
 * @param {object} props - Request { query: { name: string, email: string, pass: string } | {}}
 * @returns {object} - {status: boolean, message: string}
 */
export const checkFields = (props: { query: any | {} }) => {
  const fields = 'name' in props.query && "email" in props.query && "pass" in props.query
  let response: apiResponseTYPE;
  if (fields) {
    response = fieldsCheckIfEmpty(props.query)
  } else {
    response = { status: false, message: 'Fields are missing in the request' }
  }
  return response;
}

export const checkFieldsLogin = (props: { query: any | {} }) => {
  const fields = "email" in props.query && "pass" in props.query
  let response: apiResponseTYPE;
  if (fields) {
    response = fieldsCheckIfEmpty(props.query, 2)
  } else {
    response = { status: false, message: 'Fields are missing in the request' }
  }
  return response;
}
/**
 * Check the ID string
 * @function checkID
 * @param {string} id - Check if ID is 24 characters long
 * @returns {object} - {status: boolean, message: string}
 */
export const checkID = (id: string) => {
  let response: apiResponseTYPE = { status: false, message: 'ID is malformed (shorter/longer)' }
  if (id.length === 24) {
    response = { status: true, message: 'ID is in proper format' }
  }
  return response;
}
/**
 * Check the token
 * @function checkToken
 * @param {string} token - Check if ID is 24 characters long
 * @returns {object} - {status: boolean, message: string}
 */
export const checkTokenLength = (token: string) => {
  let response: apiResponseTYPE = { status: false, message: 'Token is malformed (shorter/longer)' }
  if (token.length === 26) {
    response = { status: true, message: 'Token is in proper format' }
  }
  return response;
}