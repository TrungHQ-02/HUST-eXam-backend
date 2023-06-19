import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userController from "../controllers/userController";
import examController from "../controllers/examController";
import questionController from "../controllers/questionController";
import imageUploadRoutes from "../controllers/imageUploadController";
let router = express.Router();

let initRoutes = (app) => {
  /*
    Related to login
  */

  app.use("/api", imageUploadRoutes);
  router.post("/login/username", userController.handleUserLogin);
  router.post("/login/email", userController.handleUserLoginViaEmail);

  /*
    Related to sign up
  */
  router.post("/signup", userController.handleUserSignup);

  router.get(
    "/user/:id",
    authMiddleware.verifyToken,
    userController.getUserInfo
  );

  // Related to CRUD user
  router.put(
    "/user/:id/update",
    authMiddleware.verifyToken,
    userController.updateUserInfo
  );

  router.delete(
    "/user/:id/delete",
    authMiddleware.verifyToken,
    userController.deleteUser
  );

  // Related to CRUD exam
  // get all exams
  router.get("/exams", examController.getAllExams);
  //get all public exams
  router.get("/exams/public", examController.getAllPublicExams);
  // get exam by id
  router.post(
    "/exam/:id",
    authMiddleware.verifyToken,
    examController.getExamById
  );

  router.post(
    "/exam",
    authMiddleware.verifyToken,
    examController.createNewExam
  );

  // update exam
  router.put(
    "/exam/:id",
    authMiddleware.verifyToken,
    examController.updateExam
  );
  // delete exam
  router.delete(
    "/exam/:id",
    authMiddleware.verifyToken,
    examController.deleteExam
  );

  // submit
  router.post(
    "/exam/:id/submit",
    authMiddleware.verifyToken,
    examController.submit
  );

  // get exam result and answer list
  router.get(
    "/exam/:id/result",
    authMiddleware.verifyToken,
    examController.getExamResult
  );

  // Related to CRUD Question
  router.post(
    "/exam/:id/questions",
    authMiddleware.verifyToken,
    questionController.addQuestionsToExam
  );
  router.put(
    "/exam/:id/questions/:questionId",
    authMiddleware.verifyToken,
    questionController.updateQuestion
  );
  router.delete(
    "/exam/:id/questions/:questionId",
    authMiddleware.verifyToken,
    questionController.deleteQuestion
  );

  router.get(
    "/exam/result/:userId",
    authMiddleware.verifyToken,
    examController.getAllExamsByUserId
  );

  router.get(
    "/exams/:authorId",
    authMiddleware.verifyToken,
    examController.getAllExamsByAuthorId
  );
  router.get(
    "/exams/:authorId/latest",
    authMiddleware.verifyToken,
    examController.getAllExamsByAuthorIdLatest
  );
  return app.use("/api", router);
};

module.exports = initRoutes;
