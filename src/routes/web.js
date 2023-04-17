import express from "express";
import userController from "../controllers/userController";

let router = express.Router();

let initRoutes = (app) => {
  router.post("/login", userController.handleUserLogin);
  return app.use("/api", router);
};

module.exports = initRoutes;
