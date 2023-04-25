import { raw } from "express";
import db from "../models";
import jwt from "jsonwebtoken";

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

module.exports = {
  handleGetAllExams: handleGetAllExams,
  handleGetAllPublicExams: handleGetAllPublicExams,
  handleGetExamById: handleGetExamById,
  handleCreateNewExam: handleCreateNewExam,
};
