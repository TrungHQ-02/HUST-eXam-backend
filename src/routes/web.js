import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userController from "../controllers/userController";

let router = express.Router();

let initRoutes = (app) => {
  router.post("/login", userController.handleUserLogin);
  router.get(
    "/getUserInfo",
    authMiddleware.verifyToken,
    userController.getUserInfo
  );
  return app.use("/api", router);
};

module.exports = initRoutes;
