"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExamResult extends Model {
    static associate(models) {
      ExamResult.belongsTo(models.User);
      ExamResult.belongsTo(models.Exam);
    }
  }
  ExamResult.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      state: DataTypes.ENUM("completed", "incomplete"),
      score: DataTypes.INTEGER,
      complete_time: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ExamResult",
    }
  );
  return ExamResult;
};
