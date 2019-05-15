import express from "express"

import * as UsersController from '../controllers/users_controller'

import { apiResponseTYPE } from '../src/types'

const router = express.Router();

router.get("/create", (req, res, next) => {
  console.log("");
  console.log("\x1b[34m", "§ Router - Incoming request:");
  console.log(req.query);
  console.log(req.headers);
  console.log("");

  // 32 - green
  // 34 - blue
  // 33 - yellow
  // 31 - red
  // 30 - black
  // 35 - pink
  // 36 - cyan
  // 37 -grey
  // console.log("\x1b[29m", `~ Source.getSourceByName: `);
  // console.log("\x1b[28m", `~ Source.getSourceByName: `);
  // console.log("\x1b[27m", `~ Source.getSourceByName: `);
  // console.log("\x1b[26m", `~ Source.getSourceByName: `);

  const token = req.headers.token ? req.headers.token.toString() : ''

  // UsersController.checkToken(token, (controllerResponse: apiResponseTYPE) => {
  //   res.send(controllerResponse)
  // })
  // * done
  UsersController.create({ query: req.query, token: token }, (controllerResponse: apiResponseTYPE) => {
    res.send(controllerResponse)
  })
  // * end-of-done

  // })

  // fields, response => res.send(response)


  // check token
  // console.log(tokenIn)
  // let token = true;
  // end-of-check token

  // if token OK
  // if (token) {
  //   if (query.name && query.email && query.pass) {
  //     console.log("yeah");

  //     res.send({ message: "User created" });
  //   } else {
  //     console.log("no");
  //     res.send({ message: "No request" });
  //   }
  //   // if token not OK
  // } else {
  //   res.send({ message: "Not authorized" });

  // }
});
// router.get("/*", (req, res, next) => {
//   res.send('user/other')
// });
export default router



