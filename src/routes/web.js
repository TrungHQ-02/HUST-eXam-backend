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
  router.post("/signup", userController.handleUserSignup);

  router.get(
    "/getUserInfo",
    authMiddleware.verifyToken,
    userController.getUserInfo
  );

  // Related to CRUD user
  router.put(
    "/user/update",
    authMiddleware.verifyToken,
    userController.updateUserInfo
  );

  router.delete(
    "/user/delete",
    authMiddleware.verifyToken,
    userController.deleteUser
  );

  return app.use("/api", router);
};

module.exports = initRoutes;
