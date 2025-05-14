const mongoose = require("mongoose");

// Define the Courses schema
const coursesSchema = new mongoose.Schema({
  courseName: { type: String },
  courseDescription: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user", // Reference to User model for the instructor
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section", // Reference to Section model
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview", // Reference to RatingAndReview model
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference to Category model
  },
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user", // Reference to User model for enrolled students
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz", // Reference to Quiz model
    },
],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema);
