import db from "../models";

let handleAddQuestionToExam = (data, examId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(data, examId);
      for (let i = 0; i < data.length; i++) {
        await db.Question.create({
          image_link: data[i].image_link,
          quiz_question: data[i].quiz_question,
          point: data[i].point,
          quiz_type: data[i].quiz_type,
          answer_list: data[i].answer_list,
          key_list: data[i].key_list,
          ExamId: examId,
        });
      }
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

let handleUpdateQuestion = (data, questionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let returnData = {};
      let question = await db.Question.findOne({
        where: {
          id: questionId,
        },
      });

      question.image_link = data.image_link;
      question.quiz_question = data.quiz_question;
      question.point = data.point;
      question.quiz_type = data.quiz_type;
      question.answer_list = data.answer_list;
      question.key_list = data.key_list;

      await question.save();
      let updatedQuestion = await db.Question.findOne({
        where: {
          id: questionId,
        },
        raw: true,
      });

      if (updatedQuestion) {
        returnData.code = 0;
        returnData.statusCode = 200;
        returnData.message = "Successfully updated";
        returnData.question = updatedQuestion;
      }

      resolve(returnData);
    } catch (error) {
      reject(error);
    }
  });
};

let handleDeleteQuestion = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {};
      let question = await db.Question.findOne({
        where: {
          id: id,
        },
      });

      if (question) {
        await question.destroy();
        data.code = 0;
        data.statusCode = 200;
        data.message = "Successfully deleted!";
      } else {
        data.code = 2;
        data.statusCode = 500;
        data.message = "The question with the provided id does not exist";
      }
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleAddQuestionToExam: handleAddQuestionToExam,
  handleUpdateQuestion: handleUpdateQuestion,
  handleDeleteQuestion: handleDeleteQuestion,
};
