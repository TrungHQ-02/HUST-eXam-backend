import questionService from "../services/questionService";
import examService from "../services/examService";

let addQuestionsToExam = async (req, res) => {
  let data = req.body.questions;
  let examId = req.params.id;
  let msg = await questionService.handleAddQuestionToExam(data, examId);
  await examService.handleModifyMaxScoreAndNumberOfQuestions(examId);
  return res.status(msg.statusCode).json(msg);
};

let updateQuestion = async (req, res) => {
  let data = req.body.question;
  let examId = req.params.id;
  let questionId = req.params.questionId;
  let msg = await questionService.handleUpdateQuestion(data, questionId);
  await examService.handleModifyMaxScoreAndNumberOfQuestions(examId);
  return res.status(msg.statusCode).json(msg);
};

let deleteQuestion = async (req, res) => {
  let questionId = req.params.questionId;
  let examId = req.params.id;
  let msg = await questionService.handleDeleteQuestion(questionId);
  await examService.handleModifyMaxScoreAndNumberOfQuestions(examId);
  return res.status(msg.statusCode).json(msg);
};

module.exports = {
  addQuestionsToExam: addQuestionsToExam,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion,
};
