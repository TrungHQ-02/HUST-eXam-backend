"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      // define association here
      Question.belongsTo(models.Exam);
    }
  }
  Question.init(
    {
      image_link: DataTypes.TEXT,
      quiz_question: DataTypes.TEXT,
      point: { type: DataTypes.FLOAT, defaultValue: 1 },
      quiz_type: DataTypes.STRING,
      answer_list: { type: DataTypes.JSON, defaultValue: [] },
      key_list: { type: DataTypes.JSON, defaultValue: [] },
    },
    {
      sequelize,
      modelName: "Question",
    }
  );
  return Question;
};
