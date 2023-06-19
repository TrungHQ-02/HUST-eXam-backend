import examService from "../services/examService";

let getAllExams = async (req, res) => {
  let examData = await examService.handleGetAllExams();

  return res.status(200).json({
    code: examData.code,
    message: examData.message,
    exams: examData.exams,
  });
};

let getAllPublicExams = async (req, res) => {
  let examData = await examService.handleGetAllPublicExams();

  return res.status(200).json({
    code: examData.code,
    message: examData.message,
    exams: examData.exams,
  });
};

let getExamById = async (req, res) => {
  let id = req.params.id;
  let password = req.body.password;
  if (!id) {
    return res.status(400).json({
      code: 1,
      message: "Missing required parameters",
    });
  }
  let examData = await examService.handleGetExamById(id, password);
  return res.status(examData.statusCode).json({
    code: examData.code,
    message: examData.message,
    exams: examData.exams,
  });
};

let createNewExam = async (req, res) => {
  let data = req.body;
  if (!data.title) {
    return res.status(400).json({
      code: 1,
      message: "Missing required parameter: title",
    });
  } else if (!data.start_time) {
    return res.status(400).json({
      code: 1,
      message: "Missing required parameter: start_time",
    });
  } else if (!data.end_time) {
    return res.status(400).json({
      code: 1,
      message: "Missing required parameter: end_time",
    });
  } else {
    let msg = await examService.handleCreateNewExam(data);
    return res.status(msg.statusCode).json(msg);
  }
};

let submit = async (req, res) => {
  let data = req.body;
  let examId = req.params.id;
  let msg = await examService.handleSubmit(examId, data);
  return res.status(msg.statusCode).json(msg);
};

let getExamResult = async (req, res) => {
  let userId = req.body.user_id;
  let examId = req.params.id;
  let msg = await examService.handleGetExamResult(examId, userId);
  return res.status(msg.statusCode).json(msg);
};

let getAllExamsByUserId = async (req, res) => {
  let userId = req.params.userId;
  console.log(userId);
  let msg = await examService.handleGetExamResultsByUserId(userId);
  return res.status(msg.statusCode).json(msg);
};

let updateExam = async (req, res) => {
  let examId = req.params.id;
  let data = req.body;
  let msg = await examService.handleUpdateExam(examId, data);
  return res.status(msg.statusCode).json(msg);
};

let deleteExam = async (req, res) => {
  let examId = req.params.id;
  let msg = await examService.handleDeleteExam(examId);
  return res.status(msg.statusCode).json(msg);
};

let getAllExamsByAuthorId = async (req, res) => {
  let authorId = req.params.authorId;
  let msg = await examService.handleGetAllExamsByAuthorId(authorId);
  return res.status(msg.statusCode).json(msg);
};
let getAllExamsByAuthorIdLatest = async (req, res) => {
  let authorId = req.params.authorId;
  let msg = await examService.handleGetAllExamsByAuthorIdLatest(authorId);
  return res.status(msg.statusCode).json(msg);
};

module.exports = {
  getAllExamsByUserId: getAllExamsByUserId,
  getAllExams: getAllExams,
  getAllPublicExams: getAllPublicExams,
  getExamById: getExamById,
  createNewExam: createNewExam,
  submit: submit,
  getExamResult: getExamResult,
  updateExam: updateExam,
  deleteExam: deleteExam,
  getAllExamsByAuthorId: getAllExamsByAuthorId,
  getAllExamsByAuthorIdLatest: getAllExamsByAuthorIdLatest,
};
