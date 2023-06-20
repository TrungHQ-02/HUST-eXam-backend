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
      number_of_question: { type: DataTypes.INTEGER, defaultValue: 0 },
      max_score: { type: DataTypes.FLOAT, defaultValue: 0 },
      is_open: DataTypes.BOOLEAN,
      state: DataTypes.ENUM("private", "public"),
      duration: { type: DataTypes.INTEGER, defaultValue: 0 }, //sec
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
