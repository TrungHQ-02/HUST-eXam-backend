const { sequelize } = require("./src/models");
// User data
const userData = [
  {
    email: "user1@example.com",
    user_password: "password1",
    user_name: "User1",
    phone: "123456789",
    gender: "male",
    role: "user",
    rank: "Beginner",
  },
  {
    email: "user2@example.com",
    user_password: "password2",
    user_name: "User2",
    phone: "987654321",
    gender: "female",
    role: "user",
    rank: "Intermediate",
  },
  {
    email: "user3@example.com",
    user_password: "password3",
    user_name: "User3",
    phone: "555555555",
    gender: "male",
    role: "user",
    rank: "Pro",
  },
];

// Exam data
const examData = [
  {
    title: "Exam 1",
    start_time: new Date("2023-04-25T00:00:00.000Z"),
    end_time: new Date("2023-04-30T23:59:59.999Z"),
    number_of_question: 0,
    max_score: 0,
    is_open: true,
    state: "public",
    author: 1,
  },
  {
    title: "Exam 2",
    start_time: new Date("2023-05-01T00:00:00.000Z"),
    end_time: new Date("2023-05-10T23:59:59.999Z"),
    number_of_question: 0,
    max_score: 0,
    is_open: true,
    author: 2,
    state: "public",
  },
  {
    title: "Exam 3",
    start_time: new Date("2023-05-15T00:00:00.000Z"),
    end_time: new Date("2023-05-20T23:59:59.999Z"),
    number_of_question: 0,
    max_score: 0,
    is_open: true,
    author: 1,
    state: "private",
    password: "hustexam@123456",
  },
];

// ExamResult data
const examResultData = [
  {
    UserId: 1,
    ExamId: 1,
    state: "completed",
    score: 8,
    complete_time: new Date("2023-04-29T10:15:00.000Z"),
  },
  {
    UserId: 1,
    ExamId: 2,
    state: "incomplete",
    score: null,
    complete_time: null,
  },
  {
    UserId: 2,
    ExamId: 1,
    state: "completed",
    score: 10,
    complete_time: new Date("2023-04-30T09:30:00.000Z"),
  },
  {
    UserId: 2,
    ExamId: 2,
    state: "completed",
    score: 9,
    complete_time: new Date("2023-05-09T14:00:00.000Z"),
  },
  {
    UserId: 3,
    ExamId: 1,
    state: "completed",
    score: 6,
    complete_time: new Date("2023-04-26T16:45:00.000Z"),
  },
  {
    UserId: 3,
    ExamId: 2,
    state: "incomplete",
    score: null,
    complete_time: null,
  },
];

// Question data
const questionData = [
  {
    ExamId: 1,
    image_link:
      "link_to_image_of_question,link_to_image_of_question2,link_to_image_of_question3",
    quiz_question: "Đề bài",
    point: 1.5,
    quiz_type: "multiple_choice",
    answer_list: ["A", "B", "C", "D"],
    key_list: ["B"],
  },
  {
    ExamId: 1,
    image_link: "link_to_image_of_question",
    quiz_question: "Đề bài",
    point: 2,
    quiz_type: "multiple_choice",
    answer_list: ["A", "B", "C", "D"],
    key_list: ["A", "B"],
  },
  {
    ExamId: 1,
    image_link: "link_to_image_of_question",
    quiz_question: "Đề bài",
    point: 1,
    quiz_type: "multiple_choice",
    answer_list: ["True", "False"],
    key_list: ["True"],
  },
  {
    ExamId: 2,
    image_link: "link_to_image_of_question",
    quiz_question: "Đề bài",
    point: 1,
    quiz_type: "multiple_choice",
    answer_list: ["A", "B", "C", "D"],
    key_list: ["A", "C"],
  },
  {
    ExamId: 2,
    image_link: "link_to_image_of_question",
    quiz_question: "Đề bài",
    point: 1,
    quiz_type: "true_false",
    answer_list: ["True", "False"],
    key_list: ["False"],
  },
  {
    ExamId: 3,
    image_link: "link_to_image_of_question",
    quiz_question: "Đề bài",
    point: 1,
    quiz_type: "multiple_choice",
    answer_list: ["A", "B", "C", "D"],
    key_list: ["C"],
  },
  {
    ExamId: 3,
    image_link: "link_to_image_of_question",
    quiz_question: "Đề bài",
    point: 1,
    quiz_type: "true_false",
    answer_list: ["True", "False"],
    key_list: ["False"],
  },
];

(async () => {
  await sequelize.sync({ force: true });
  await sequelize.models.User.bulkCreate(userData);
  await sequelize.models.Exam.bulkCreate(examData);
  await sequelize.models.Question.bulkCreate(questionData);
})();
