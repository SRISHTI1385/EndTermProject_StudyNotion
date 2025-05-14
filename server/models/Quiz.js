const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Quiz Schema with embedded questions
// Quiz Schema to represent the entire structure of the quiz
const quizSchema = new mongoose.Schema(
  {
    // Reference to the Course this quiz belongs to
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    // Number of questions in the quiz
    TotalQuestion: { type: Number, required: true },

    // Time limit for the quiz in minutes (or seconds, depending on your preference)
    QuizTime: { type: Number, required: true },  // Time limit in minutes, change as needed

    // Array of questions, each question contains the question text, options, and the correct answer
    questions: [
      {
        // Question text
        questionText: { type: String, required: true },

        // Array of options (4 options per question)
        options: [
          { type: String, required: true }, // Option 1
          { type: String, required: true }, // Option 2
          { type: String, required: true }, // Option 3
          { type: String, required: true }, // Option 4
        ],

        // Correct option index (0-3)
        correctOption: { type: Number, required: true, min: 0, max: 3 },
      },
    ],
  },
  { timestamps: true }
);

// Create a model for Quiz
const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
