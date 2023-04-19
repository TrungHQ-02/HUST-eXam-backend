"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExamResult extends Model {
    static associate(models) {
      ExamResult.belongsTo(models.User, { foreignKey: "userId" });
      ExamResult.belongsTo(models.Exam, { foreignKey: "examId" });
    }
  }
  ExamResult.init(
    {
      state: DataTypes.STRING,
      score: DataTypes.INTEGER,
      completeTime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ExamResult",
    }
  );
  return ExamResult;
};
