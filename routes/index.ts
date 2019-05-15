import express from "express";

import { showRequest } from "../modules/show_request";
import * as UsersController from "../controllers/user_controller";

import { apiResponseTYPE } from "../src/types";

const router = express.Router();

// login
router.get("/login", (req, res, next) => {
  showRequest(req.headers, req.query);
  const token = req.headers.token ? req.headers.token.toString() : "";
  UsersController.login(
    { query: req.query, token: token },
    (controllerResponse: apiResponseTYPE) => {
      res.send(controllerResponse);
    }
  );
});
// rest
router.get("/*", (req, res, next) => {
  res.send({ status: true, message: "Welcome to the API" });
});

export default router;
