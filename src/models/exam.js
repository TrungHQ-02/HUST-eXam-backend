"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    static associate(models) {
      Exam.hasMany(models.Question, {
        foreignKey: "quizId",
      });
      Exam.belongsToMany(models.User, {
        through: "examresults",
        foreignKey: "examId",
      });
    }
  }
  Exam.init(
    {
      title: DataTypes.STRING,
      start_time: DataTypes.DATE,
      end_time: DataTypes.DATE,
      number_of_question: DataTypes.INTEGER,
      max_score: DataTypes.FLOAT,
      state: DataTypes.ENUM("private", "public"),
    },
    {
      sequelize,
      modelName: "Exam",
    }
  );
  return Exam;
};
