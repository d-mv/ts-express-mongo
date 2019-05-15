import express from "express"

import * as UsersController from '../controllers/user_controller'

import { showRequest } from '../modules/show_request'
import { apiResponseTYPE } from '../src/types'

const router = express.Router();

// create user
router.get("/create", (req, res, next) => {
  showRequest(req.headers, req.query)
  const token = req.headers.token ? req.headers.token.toString() : ''
  UsersController.create({ query: req.query, token: token }, (controllerResponse: apiResponseTYPE) => {
    res.send(controllerResponse)
  })
});
// check if token login available
router.get("/check", (req, res, next) => {
  showRequest(req.headers, req.query)
  const token = req.headers.token ? req.headers.token.toString() : ''
  UsersController.check(token, (controllerResponse: apiResponseTYPE) => {
    res.send(controllerResponse)
  })
});

// get user
router.get("/:id", (req, res, next) => {
  showRequest(req.headers, req.params.id)
  const token = req.headers.token ? req.headers.token.toString() : ''
  UsersController.get({ id: req.params.id, token: token }, (controllerResponse: apiResponseTYPE) => {
    res.send(controllerResponse)
  })
});

export default router



