// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Controllers
const {getAllUsers}=require("../controllers/adminController")
// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");


// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

const {
  updateCourseProgress,
  markQuizCompleted,
  getQuizProgress,
} = require("../controllers/courseProgress");

// Quiz Controllers Import
const {
  createQuiz,
  getQuiz,
  getQuizDetails,
  updateQuiz,
  deleteQuiz,
  createQuestion,   // Added
  updateQuestion,   // Added
  deleteQuestion    // Added
} = require("../controllers/Quiz");

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Course
router.post("/getCourseDetails", getCourseDetails);
// Get Full Details for a Specific Course
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// Delete a Course
router.delete("/deleteCourse", deleteCourse);

// Update Course Progress (For Students)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
router.post("/markQuizCompleted", auth, isStudent, markQuizCompleted);
router.post("/getQuizProgress", auth, isStudent, getQuizProgress);
// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here

router.post("/getAllUsers", auth, getAllUsers);
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

// ********************************************************************************************************
//                                      Quiz routes (For Instructors)
// ********************************************************************************************************

// Create a Quiz for a Course
router.post("/createQuiz", auth, isInstructor, createQuiz);
// Get all Quizzes for a Course
router.get("/getQuiz", auth, isInstructor, getQuiz);
// Get Specific Quiz Details

router.post("/getQuizDetails", auth, isInstructor, getQuizDetails);
// Update a Quiz
router.post("/updateQuiz", auth, isInstructor, updateQuiz);
// Delete a Quiz
router.delete("/deleteQuiz", auth, isInstructor, deleteQuiz);

// ********************************************************************************************************
//                                      Quiz Question routes (For Instructors)
// ********************************************************************************************************

// Create a Question for a Quiz
router.post("/createQuestion", auth, isInstructor, createQuestion);  // Added
// Update a Question in a Quiz
router.post("/updateQuestion", auth, isInstructor, updateQuestion);  // Added
// Delete a Question from a Quiz
router.delete("/deleteQuestion", auth, isInstructor, deleteQuestion);  // Added


module.exports = router;
