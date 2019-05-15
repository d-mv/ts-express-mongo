import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

axios.defaults.baseURL = `${process.env.MYSELF}`;

/**
 * (async) Call API with provided url and return API response
 * @param  {string} request
 * @return {object} - Returns API response
 */
export const callAPI = async (request: string) => {
  // set url
  const url = request ? `/${request}` : "/";
  // call api and callback with result
  const response = await axios(url).then((response: any) => response.data);
  return response;
};
