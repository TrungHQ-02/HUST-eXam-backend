import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userController from "../controllers/userController";
import examController from "../controllers/examController";

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

  // Related to CRUD exam
  // get all exams
  router.get("/exams", examController.getAllExams);
  //get all public exams
  router.get("/exams/public", examController.getAllPublicExams);
  // get exam by id
  router.get("/exam/:id", examController.getExamById);

  router.post("/exam", examController.createNewExam);

  return app.use("/api", router);
};

module.exports = initRoutes;
