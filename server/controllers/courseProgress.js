const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")
const Quiz = require("../models/Quiz");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id


  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      })
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideos array
      courseProgress.completedVideos.push(subsectionId)
    }

    // Save the updated course progress
    await courseProgress.save()

    return res.status(200).json({ message: "Course progress updated" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// GET /quiz/progress/:courseId/:quizId
exports.getQuizProgress = async (req, res) => {
  try {
    const { courseId, quizId } = req.body;
    const userId = req.user.id;
    console.log(req.body);
    console.log(courseId);
    console.log(quizId);
    const courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId,
    });
   console.log(courseProgress+"fcgvh");
    if (!courseProgress) {
      return res.status(404).json({ error: "Course progress not found" });
    }
    console.log(courseProgress+"gch");
    const existingQuiz = courseProgress.completedQuizzes.find(q =>
      q.quizId.equals(quizId)
    );
    // console.log(existingQuiz);
    //  console.log(typeof existingQuiz.score+"vgvhgvh");
    if(existingQuiz)
    return res.status(200).json({ success: true, data: existingQuiz });
    return res.status(404).json({ error: "Not found" });
  } catch (error) {
    console.error("Error fetching quiz progress:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.markQuizCompleted = async (req, res) => {
  console.log("sayg");
    try {
      console.log("hbdhjdhbdhhd")
      const { courseId, quizId, score } = req.body;
      const userId = req.user.id;
     console.log(req.body);
      // Validate quiz exists
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
  console.log("hgjkl");
      // Find course progress for the user
      let courseProgress = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      });
    console.log(courseProgress+"  hhhhhhb");
      if (!courseProgress) {
        return res.status(404).json({ error: "Course progress not found" });
      }
  
      console.log(quizId+" njnjn");
      console.log(score+" jjj");
      // Check if quiz is already completed
      const existingQuiz = courseProgress.completedQuizzes.find((q) =>
        q.quizId.equals(quizId)
      );
      console.log(existingQuiz);
  
      if (existingQuiz) {
        // return res.status(200).json({ success: true, data: existingQuiz});
        return res.status(400).json({ error: "Quiz already completed" });
      }
  console.log("aaaaa");
      // Add quiz to completedQuizzes
      courseProgress.completedQuizzes.push({
        quizId,
        score,
        isCompleted: true,
      });
  

      await courseProgress.save();
      console.log("yyyeess");
      return res.status(200).json({ success:true,message: "Quiz progress updated" });
    } catch (error) {
      console.error("Error in updateQuizProgress:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id

//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }