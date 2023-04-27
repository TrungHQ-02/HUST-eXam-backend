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
  if (!id) {
    return res.status(400).json({
      code: 1,
      message: "Missing required parameters",
    });
  }
  console.log(id);
  let examData = await examService.handleGetExamById(id);
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

module.exports = {
  getAllExams: getAllExams,
  getAllPublicExams: getAllPublicExams,
  getExamById: getExamById,
  createNewExam: createNewExam,
};
