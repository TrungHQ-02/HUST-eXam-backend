"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    static associate(models) {
      Exam.hasMany(models.Question);
      Exam.belongsToMany(models.User, {
        through: models.ExamResult,
      });
      Exam.hasMany(models.ExamResult);
    }
  }
  Exam.init(
    {
      title: DataTypes.TEXT,
      start_time: DataTypes.DATE,
      end_time: DataTypes.DATE,
      number_of_question: DataTypes.INTEGER,
      max_score: DataTypes.FLOAT,
      is_open: DataTypes.BOOLEAN,
      state: DataTypes.ENUM("private", "public"),
      duration: DataTypes.INTEGER, //sec
      password: DataTypes.STRING, // password for private
      author: DataTypes.INTEGER, // id of user who created the exam
    },
    {
      sequelize,
      modelName: "Exam",
    }
  );
  return Exam;
};
