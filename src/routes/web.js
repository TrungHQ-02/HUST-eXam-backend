import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userController from "../controllers/userController";
import examController from "../controllers/examController";
import questionController from "../controllers/questionController";
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
  router.post("/exam/:id", examController.getExamById);

  router.post("/exam", examController.createNewExam);

  // update exam
  router.put("/exam/:id", examController.updateExam);
  // delete exam
  router.delete("/exam/:id", examController.deleteExam);

  // submit
  router.post("/exam/:id/submit", examController.submit);

  // get exam result and answer list
  router.get("/exam/:id/result", examController.getExamResult);

  // Related to CRUD Question
  router.post("/exam/:id/questions", questionController.addQuestionsToExam);
  router.put(
    "/exam/:id/questions/:questionId",
    questionController.updateQuestion
  );
  router.delete(
    "/exam/:id/questions/:questionId",
    questionController.deleteQuestion
  );

  router.get("/exam/result/:userId", examController.getAllExamsByUserId);

  router.get("/exams/:authorId", examController.getAllExamsByAuthorId);
  router.get(
    "/exams/:authorId/latest",
    examController.getAllExamsByAuthorIdLatest
  );
  return app.use("/api", router);
};

module.exports = initRoutes;
