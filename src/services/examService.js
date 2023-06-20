import db from "../models";

let handleGetAllExams = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let exams = await db.Exam.findAll({
        raw: true,
        attributes: { exclude: ["password"] },
      });
      resolve({
        code: 0,
        message: "OK",
        exams: exams,
      });
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
        attributes: { exclude: ["password"] },
      });
      resolve({
        code: 0,
        message: "OK",
        exams: exams,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let handleGetExamById = (id, password) => {
  return new Promise(async (resolve, reject) => {
    let data = {};
    // console.log(typeof password);
    const examData = await db.Exam.findAll({
      where: {
        id: id,
      },
      include: {
        model: db.Question,
        attributes: { exclude: ["key_list"] },
      },
    });
    let rawData = JSON.parse(JSON.stringify(examData, null, 2));

    // console.log(typeof rawData[0].password);
    if (rawData[0].password) {
      if (JSON.stringify(password) !== JSON.stringify(rawData[0].password)) {
        resolve({
          statusCode: 401,
          code: 3,
          message: "Wrong password",
        });
      } else if (rawData.length === 0) {
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
    } else if (rawData.length === 0) {
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

    const currentDate = new Date();
    const myDate = new Date(keyData[0].end_time);
    console.log(keyData[0].end_time);

    if (currentDate.getTime() > myDate.getTime()) {
      resolve({
        code: 3,
        statusCode: 400,
        message: "This exam has been closed",
      });
    } else if (keyData[0].is_open === false) {
      resolve({
        code: 3,
        statusCode: 400,
        message: "This exam has been closed",
      });
    } else {
      let keyList = keyData[0].Questions;
      let answerList = data.answers;
      let res = 0;
      for (let i = 0; i < answerList.length; i++) {
        let quesId = answerList[i].question_id;
        // get key list of that question
        let keys = getKeyListById(quesId, keyList);
        let point = getPointById(quesId, keyList);
        if (
          JSON.stringify(keys.sort()) ===
          JSON.stringify(answerList[i].selected_options.sort())
        ) {
          res += point;
        } else {
          res += 0;
        }
      }

      // check if user had submitted that test before
      let submitted = await db.ExamResult.findAll({
        where: {
          ExamId: examId,
          UserId: data.user_id,
        },
        raw: true,
      });

      if (submitted.length === 1) {
        resolve({
          code: 2,
          statusCode: 400,
          message: "You have submitted to this exam before",
        });
      } else {
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
      }
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

      const currentDate = new Date();
      const myDate = new Date(keyData[0].end_time);
      console.log(keyData[0].end_time);

      if (currentDate.getTime() < myDate.getTime()) {
        resolve({
          code: 3,
          statusCode: 400,
          message:
            "This exam is not finished yet, the results cannot be viewed.",
        });
      } else {
        let keyArray = keyList.map(function (item) {
          return {
            questionId: item.id,
            answerList: JSON.parse(item.answer_list),
            keys: JSON.parse(item.key_list),
          };
        });
        const resultData = await db.ExamResult.findOne({
          where: {
            ExamId: examId,
            UserId: userId,
          },
          raw: true,
        });

        resolve({
          code: 0,
          statusCode: 200,
          message: "OK",
          score: resultData.score,
          complete_time: resultData.complete_time,
          keys: keyArray,
        });
      }
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

let handleUpdateExam = (examId, data) => {
  return new Promise(async (resolve, reject) => {
    // title: DataTypes.TEXT,
    //   start_time: DataTypes.DATE,
    //   end_time: DataTypes.DATE,
    //   number_of_question: { type: DataTypes.INTEGER, defaultValue: 0 },
    //   max_score: { type: DataTypes.FLOAT, defaultValue: 0 },
    //   is_open: DataTypes.BOOLEAN,
    //   state: DataTypes.ENUM("private", "public"),
    //   duration: { type: DataTypes.INTEGER, defaultValue: 0 }, //sec
    //   password: DataTypes.STRING, // password for private
    //   author: DataTypes.INTEGER, // id of user who created the exam
    try {
      let exam = await db.Exam.findOne({
        where: { id: examId },
      });

      if (exam) {
        exam.title = data.title;
        exam.start_time = data.start_time;
        exam.end_time = data.end_time;
        exam.number_of_question = data.number_of_question;
        exam.max_score = data.max_score;
        exam.is_open = data.is_open;
        exam.state = data.state;
        exam.duration = data.duration;
        exam.password = data.password;
        exam.author = data.author;

        console.log(new Date());

        await exam.save();
        resolve({
          code: 0,
          statusCode: 200,
          message: "Successfully updated",
        });
      } else {
        resolve({
          code: 2,
          statusCode: 404,
          message: "Exam not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let handleDeleteExam = (id) => {
  return new Promise(async (resolve, reject) => {
    let exam = await db.Exam.findOne({
      where: {
        id: id,
      },
    });

    if (exam) {
      await exam.destroy();
      resolve({
        code: 0,
        statusCode: 200,
        message: "Successfully deleted!",
      });
    } else {
      resolve({
        code: 2,
        statusCode: 404,
        message: "Exam does not exist",
      });
    }
  });
};

let handleGetAllExamsByAuthorId = (authorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Exam.findAll({
        where: {
          author: authorId,
        },
        raw: true,
      });

      // console.log(data);
      resolve({
        code: 0,
        statusCode: 200,
        message: "OK",
        exams: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let handleGetAllExamsByAuthorIdLatest = (authorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Exam.findOne({
        where: {
          author: authorId,
        },
        raw: true,
        order: [["createdAt", "DESC"]],
      });

      // console.log(data);
      resolve({
        code: 0,
        statusCode: 200,
        message: "OK",
        exams: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let handleGetExamResultsByExamId = (examId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let results = await db.ExamResult.findAll({
        where: {
          ExamId: examId,
        },
        raw: true,
      });

      // console.log(results);
      resolve({
        code: 0,
        statusCode: 200,
        message: "OK",
        results: results,
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
  handleUpdateExam: handleUpdateExam,
  handleDeleteExam: handleDeleteExam,
  handleGetAllExamsByAuthorId: handleGetAllExamsByAuthorId,
  handleGetAllExamsByAuthorIdLatest: handleGetAllExamsByAuthorIdLatest,
  handleGetExamResultsByExamId: handleGetExamResultsByExamId,
};
