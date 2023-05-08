import { resolveInclude } from "ejs";
import db from "../models";

let handleGetAllExams = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let exams = await db.Exam.findAll({ raw: true });
      console.log(exams);
      resolve({
        code: 0,
        message: "OK",
        exams: exams,
      });
      resolve(exams);
    } catch (error) {
      reject(error);
    }
  });
};

let handleGetAllPublicExams = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let exams = await db.Exam.findAll({
        where: {
          state: "public",
        },
        raw: true,
      });
      console.log(exams);
      resolve({
        code: 0,
        message: "OK",
        exams: exams,
      });
      resolve(exams);
    } catch (error) {
      reject(error);
    }
  });
};

let handleGetExamById = (id) => {
  return new Promise(async (resolve, reject) => {
    let data = {};
    const examData = await db.Exam.findAll({
      where: {
        id: id,
      },
      include: db.Question,
    });
    let rawData = JSON.parse(JSON.stringify(examData, null, 2));
    if (rawData.length === 0) {
      data.statusCode = 401;
      data.code = 2;
      data.message = "The exam with provided id does not exist";
      resolve(data);
    } else {
      data.statusCode = 200;
      data.code = 0;
      data.message = "OK";
      data.exams = rawData;
      resolve(data);
    }
  });
};

let handleCreateNewExam = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Exam.create({
        title: data.title,
        start_time: new Date(data.start_time),
        end_time: new Date(data.end_time),
        number_of_question: 0,
        max_score: 0,
        is_open: false,
        state: data.state ? data.state : "public",
      });

      resolve({
        code: 0,
        statusCode: 201,
        message: "Successfully created!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let handleSubmit = (examId, data) => {
  return new Promise(async (resolve, reject) => {
    // get question list
    const examData = await db.Exam.findAll({
      where: {
        id: examId,
      },
      include: db.Question,
    });

    let keyData = JSON.parse(JSON.stringify(examData, null, 2));
    let keyList = keyData[0].Questions;

    // console.log(keyList);
    let answerList = data.answers;
    // console.log(answerList);

    let res = 0;
    for (let i = 0; i < answerList.length; i++) {
      let quesId = answerList[i].question_id;

      // get key list of that question
      let keys = getKeyListById(quesId, keyList);
      console.log(keys);

      if (
        JSON.stringify(keys) === JSON.stringify(answerList[i].selected_options)
      ) {
        res += 1;
      } else {
        res += 0;
      }
    }
    console.log(res);

    try {
      await db.ExamResult.create({
        state: "completed",
        score: res,
        complete_time: new Date(),
        ExamId: examId,
        UserId: data.user_id,
      });

      resolve({
        code: 0,
        statusCode: 200,
        message: "Successfully submitted!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

function getKeyListById(quesId, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === quesId) {
      return JSON.parse(arr[i].key_list);
    }
  }
  return null;
}

let handleGetExamResult = (examId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const examData = await db.Exam.findAll({
        where: {
          id: examId,
        },
        include: db.Question,
      });

      let keyData = JSON.parse(JSON.stringify(examData, null, 2));
      let keyList = keyData[0].Questions;

      let keyArray = keyList.map(function (item) {
        return {
          questionId: item.id,
          keys: JSON.parse(item.key_list),
        };
      });

      console.log(keyArray);
      const resultData = await db.ExamResult.findOne({
        where: {
          ExamId: examId,
          UserId: userId,
        },
        raw: true,
      });

      console.log(resultData);
      resolve({
        code: 0,
        statusCode: 200,
        message: "OK",
        score: resultData.score,
        complete_time: resultData.complete_time,
        keys: keyArray,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleGetAllExams: handleGetAllExams,
  handleGetAllPublicExams: handleGetAllPublicExams,
  handleGetExamById: handleGetExamById,
  handleCreateNewExam: handleCreateNewExam,
  handleSubmit: handleSubmit,
  handleGetExamResult: handleGetExamResult,
};
