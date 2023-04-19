import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userController from "../controllers/userController";

let router = express.Router();

let initRoutes = (app) => {
  /*
    Related to login
  */
  router.post("/login/username", userController.handleUserLogin);
  router.post("/login/email", userController.handleUserLoginViaEmail);

  /*
    Related to sign up
  */

  router.get(
    "/getUserInfo",
    authMiddleware.verifyToken,
    userController.getUserInfo
  );
  return app.use("/api", router);
};

module.exports = initRoutes;
