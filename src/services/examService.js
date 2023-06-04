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
        is_open: data.is_open ? data.is_open : false,
        state: data.state ? data.state : "public",
        duration: data.duration ? data.duration : 1000000,
        password: data.password ? data.password : "",
        author: data.author ? data.author : null,
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

    console.log("check keylist", keyList);
    let answerList = data.answers;
    // console.log(answerList);

    let res = 0;
    for (let i = 0; i < answerList.length; i++) {
      let quesId = answerList[i].question_id;

      // get key list of that question
      let keys = getKeyListById(quesId, keyList);
      // console.log("check key", keys);

      // console.log("check point", getPointById(quesId, keyList));
      let point = getPointById(quesId, keyList);
      if (
        JSON.stringify(keys) === JSON.stringify(answerList[i].selected_options)
      ) {
        res += point;
      } else {
        res += 0;
      }
    }
    console.log(res);

    console.log("check duration", keyData[0].duration);

    try {
      await db.ExamResult.create({
        state: "completed",
        score: res,
        complete_time: data.complete_time
          ? data.complete_time
          : keyData[0].duration, // in second
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

function getPointById(quesId, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === quesId) {
      return arr[i].point;
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

let handleModifyMaxScoreAndNumberOfQuestions = (examId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const examData = await db.Exam.findOne({
        where: {
          id: examId,
        },
        include: db.Question,
      });

      let keyData = JSON.parse(JSON.stringify(examData, null, 2));
      // console.log(keyData[0].Questions);
      let list = keyData.Questions;
      let numberOfQuestion = 0;
      let totalPoint = 0;

      for (let i = 0; i < list.length; i++) {
        numberOfQuestion += 1;
        totalPoint += list[i].point;
      }
      console.log(numberOfQuestion, totalPoint);
      examData.number_of_question = numberOfQuestion;
      examData.max_score = totalPoint;
      await examData.save();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

let handleGetExamResultsByUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let results = await db.ExamResult.findAll({
        where: {
          UserId: userId,
        },
        raw: true,
      });

      console.log(results);
      resolve({
        code: 0,
        statusCode: 200,
        message: "OK",
        allTests: results,
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
  handleModifyMaxScoreAndNumberOfQuestions:
    handleModifyMaxScoreAndNumberOfQuestions,
  handleGetExamResultsByUserId: handleGetExamResultsByUserId,
};
