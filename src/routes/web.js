import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userController from "../controllers/userController";

let router = express.Router();

let initRoutes = (app) => {
  router.post("/login", userController.handleUserLogin);
  // frontend requests (via post) and sends to server the data of the user, including user_name and user_password
  router.post("/login-via-email", userController.handleUserLoginViaEmail);
  // frontend requests (via post) and sends to server the data of the user, including email and user_password

  router.get(
    "/getUserInfo",
    authMiddleware.verifyToken,
    userController.getUserInfo
  );
  return app.use("/api", router);
};

module.exports = initRoutes;
