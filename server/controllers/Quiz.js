const Course = require("../models/Course");
const Quiz = require("../models/Quiz");

// Create a new quiz for a course
exports.createQuestion = async (req, res) => {
    try {
      const { QuizTime,TotalQuestion,courseId, questions } = req.body;
  
      // Validate that all required fields are provided
      const questionText = questions[0].questionText;
      const options = questions[0].options;
      const correctOption = questions[0].correctOption;
      
     console.log(QuizTime,TotalQuestion);
      if (!courseId || !questionText || !options || options.length !== 4 || correctOption === undefined) {
        return res.status(470).json({
          success: false,
          message: "Course ID, question text, options (with 4 choices), and correct option are required"
        });
      }
  
      // Ensure options array contains exactly 4 options
      if (options.length !== 4) {
        return res.status(490).json({
          success: false,
          message: "Each question must have exactly 4 options"
        });
      }
  
      // Convert the correctOption to an index between 0 and 3
      const correctOptionText = parseInt(correctOption.replace('Option ', '').trim()) - 1;
      if (correctOptionText < 0 || correctOptionText > 3) {
        return res.status(403).json({
          success: false,
          message: "Correct option must be an index between 0 and 3"
        });
      }
  
      // Create the question object
      const newQuestion = {
        questionText,
        options,
        correctOption: correctOptionText,
      };
  
      // Find the existing quiz for this course
      let quiz = await Quiz.findOne({ courseId });
  
      if (!quiz) {
        // If no quiz exists, create a new quiz and add the question
        quiz = new Quiz({
          courseId,
          TotalQuestion,
         QuizTime,
          questions: [newQuestion],
        });
        await quiz.save();
  
        // Add the quiz reference to the course's quizzes field
        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          { $push: { quizzes: { $each: [quiz._id], $position: 0 } } },
          { new: true }
        )
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
          .populate("quizzes") // Populate quizzes in the course response
          .exec();
  
        // Check if the updated course is null
        if (!updatedCourse) {
          return res.status(405).json({
            success: false,
            message: "Course not found after adding the quiz",
          });
        }
  
        return res.status(201).json({
          success: true,
          message: "New quiz created and question added successfully",
          data: updatedCourse, // Return updated course with populated quizzes
        });
      }
  
      // If quiz exists, add the question to the quiz
      quiz.questions.push(newQuestion);
      await quiz.save();
  
      // Update the course with the reference to the existing quiz
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $push: { quizzes: { $each: [quiz._id], $position: 0 } } },
        { new: true }
      )
        .populate("quizzes") // Populate quizzes in the course response
        .exec();
  
      // Check if the updated course is null
      if (!updatedCourse) {
        return res.status(406).json({
          success: false,
          message: "Course not found after adding the question",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Question added to the existing quiz successfully",
        data: updatedCourse, // Return updated course with populated quizzes
      });
    } catch (error) {
      console.error("Error adding question to quiz:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding the question",
      });
    }
  };
  
  
// Get all quizzes for a specific course
exports.getQuiz = async (req, res) => {
  try {
    const { courseId } = req.query;

    // Check if courseId is provided
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    // Find all quizzes for the given courseId
    const quizzes = await Quiz.find({ courseId });

    return res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching quizzes" });
  }
};

// Get details of a specific quiz
exports.getQuizDetails = async (req, res) => {
  try {
    const { quizId } = req.body;
    console.log(" vbnm,.")
    // Check if quizId is provided
    if (!quizId) {
      return res.status(405).json({ success: false, message: "Quiz ID is required" });
    }

    // Find quiz details by quizId
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    return res.status(506).json({ success: false, message: "An error occurred while fetching the quiz details" });
  }
};

// Update an existing quiz
exports.updateQuiz = async (req, res) => {
  try {
    console.log("ggfggc");
    const { quizId, questions, courseId } = req.body;
    console.log("ggfggc"+courseId+" ");

    if (!quizId || !questions || questions.length === 0 || !courseId) {
      return res.status(406).json({
        success: false,
        message: "Quiz ID, questions, and course ID are required",
      });
    }

    // Find the course by courseId
    const course = await Course.findById(courseId);
     console.log(course);
    if (!course) {
      return res.status(408).json({
        success: false,
        message: "Course not found",
      });
    }

    // Find the quiz within the course by quizId
    const quiz = await Quiz.findById(quizId); // Use the Mongoose method to find quiz by id in the quizzes array
    console.log("foundeddddddddd"+quiz.questions.length);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found in the course",
      });
    }
    if (quiz.questions.length==quiz.TotalQuestion) {
      return res.status(408).json({
        success: false,
        message: "Cannot add more Questions",
      });
    }

    // Validate the new questions
    questions.forEach((question) => {
      if (question.options.length !== 4) {
        throw new Error("Each question must have exactly 4 options.");
      }
      if (question.correctOption < 0 || question.correctOption > 3) {
        throw new Error("The correct option index must be between 0 and 3.");
      }
    });
  console.log("question validated");

  console.log(questions[0].correctOption)
  const questionText=questions[0].questionText;
  const options=questions[0].options;
  const correctOption=parseInt(questions[0].correctOption.replace('Option ', '').trim()) - 1;
  const newQuestion = {
    questionText,
    options,
    correctOption,
  };
  console.log(newQuestion);
     
    // Add new questions to the quiz
    quiz.questions.push(newQuestion); // Spread the questions into the quiz's questions array
   await quiz.save();

   const updatedCourse = await Course.findById(courseId)
   .populate({
    path: "courseContent",
    populate: {
      path: "subSection",
    },
  })
    .populate("quizzes") // Populate quizzes in the course response
    .exec();
   


    // Save the course with the updated quiz
    // await course.save();

    // Return the updated course with the populated quizzes
    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully and course updated with quiz at position 0",
      data:updatedCourse, // Return the updated course
    });
  } catch (error) {
    console.error("Error updating quiz:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the quiz",
    });
  }
};


  

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { quizId, courseId } = req.body;

    // Check if quizId and courseId are provided
    if (!quizId || !courseId) {
      return res.status(400).json({ success: false, message: "Quiz ID and Course ID are required" });
    }

    // Remove the quiz from the course's quiz list
    await Course.findByIdAndUpdate(
      { _id: courseId },
      { $pull: { quizzes: quizId } },
      { new: true }
    );

    // Delete the quiz
    const quiz = await Quiz.findByIdAndDelete({ _id: quizId });

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({ success: true, message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return res.status(500).json({ success: false, message: "An error occurred while deleting the quiz" });
  }
};



exports.createQuiz = async (req, res) => {
    try {
      const { courseId, questions } = req.body;
  
      // Check if all necessary fields are provided
      const questionText = questions[0].questionText;
      const options = questions[0].options;
      const correctOption = questions[0].correctOption;
      
      // Validate input fields
      if (!courseId || !questionText || !options || options.length !== 4 || correctOption === undefined) {
        return res.status(400).json({
          success: false,
          message: "Course ID, question text, options (with 4 choices), and correct option are required"
        });
      }
  
      // Validate that the options array contains exactly 4 options
      if (options.length !== 4) {
        return res.status(400).json({
          success: false,
          message: "Each question must have exactly 4 options"
        });
      }
  
      // Ensure correctOption is between 0 and 3 (index of the correct option)
      const correctOptionText = parseInt(correctOption.replace('Option ', '').trim()) - 1;
      if (correctOptionText < 0 || correctOptionText > 3) {
        return res.status(400).json({
          success: false,
          message: "Correct option must be an index between 0 and 3"
        });
      }
  
      // Create the new question object
      const newQuestion = {
        questionText,
        options,
        correctOption: correctOptionText,
      };
  
      // Find the existing quiz for the course
      let quiz = await Quiz.findOne({ courseId });
  
      if (!quiz) {
        // If no quiz exists for the course, create a new one and add the question
        quiz = new Quiz({
          courseId,
          questions: [newQuestion],
        });
  
        // Save the new quiz
        await quiz.save();
  
        // Add the quiz reference to the course (if the course exists)
        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          { $push: { quizzes: quiz._id } },
          { new: true }
        )
          .populate("quizzes") // Populate quizzes in the course response
          .exec();
  
        return res.status(201).json({
          success: true,
          message: "New quiz created and question added successfully",
          data: updatedCourse, // Return updated course with populated quizzes
        });
      }
  
      // If quiz already exists for the course, add the new question to it
      quiz.questions.push(newQuestion);
      await quiz.save();
  
      // Add the quiz reference to the course (if the course exists)
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $push: { quizzes: quiz._id } },
        { new: true }
      )
        .populate("quizzes") // Populate quizzes in the course response
        .exec();
  
      return res.status(200).json({
        success: true,
        message: "Question added to the existing quiz successfully",
        data: updatedCourse, // Return updated course with populated quizzes
      });
    } catch (error) {
      console.error("Error adding question to quiz:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding the question",
      });
    }
  };
  
  
// Update a specific question within the quiz
exports.updateQuestion = async (req, res) => {
  try {
    const { quizId, questionId, updatedQuestion } = req.body;

    // Check if quizId, questionId, and updatedQuestion are provided
    if (!quizId || !questionId || !updatedQuestion) {
      return res.status(402).json({ success: false, message: "Quiz ID, question ID, and updated question are required" });
    }

    // Find the quiz and update the specific question
    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, "questions._id": questionId },
      {
        $set: {
          "questions.$": updatedQuestion, // Update the specific question
        },
      },
      { new: true }
    );

    if (!quiz) {
      return res.status(400).json({ success: false, message: "Quiz or question not found" });
    }

    return res.status(200).json({ success: true, message: "Question updated successfully", data: quiz });
  } catch (error) {
    console.error("Error updating question:", error);
    return res.status(500).json({ success: false, message: "An error occurred while updating the question" });
  }
};

// Delete a specific question from a quiz
exports.deleteQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.body;

    // Check if quizId and questionId are provided
    if (!quizId || !questionId) {
      return res.status(4090).json({ success: false, message: "Quiz ID and question ID are required" });
    }

    // Find the quiz and remove the specific question
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $pull: { questions: { _id: questionId } } },
      { new: true }
    );

    if (!quiz) {
      return res.status(4074).json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({ success: true, message: "Question deleted successfully from quiz" });
  } catch (error) {
    console.error("Error deleting question from quiz:", error);
    return res.status(500).json({ success: false, message: "An error occurred while deleting the question" });
  }
};
