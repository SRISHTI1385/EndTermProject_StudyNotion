const mongoose = require("mongoose")

const courseProgress = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
  completedQuizzes: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
      score: {
        type: Number,
        default: 0,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ]
})

module.exports = mongoose.model("courseProgress", courseProgress)