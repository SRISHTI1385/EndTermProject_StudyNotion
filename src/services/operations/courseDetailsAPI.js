













import { toast } from "react-hot-toast"

import { updateCompletedLectures } from "../../slices/viewCourseSlice"
// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector"
import { courseEndpoints } from "../apis"

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
  GET_USERS_API,
  QUIZ_CHECK_API,
  QUIZ_COMPLETION_API,
  CREATE_QUIZ_API, // Assuming this is the endpoint for creating quizzes
  UPDATE_QUIZ_API, 
  DELETE_QUIZ_API, // Added for deleting questions from quiz
  GET_QUIZ_API,
  CREATE_QUESTION_API,  // New endpoint for creating questions
  UPDATE_QUESTION_API,  // New endpoint for updating questions
  DELETE_QUESTION_API,
  
} = courseEndpoints

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("GET_ALL_COURSE_API API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    })
    console.log("COURSE_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}

// fetching the available course categories
export const fetchCourseCategories = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR............", error)
    toast.error(error.message)
  }
  return result
}

// add the course details
export const addCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details")
    }
    toast.success("Course Details Added Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error.message)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// edit the course details
export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("EDIT COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("EDIT COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// create a section
export const createSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }
    toast.success("Course Section Created")
    result = response?.data?.updatedCourse
  } catch (error) {
    console.log("CREATE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// create a subsection
export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture")
    }
    toast.success("Lecture Added")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// update a section
export const updateSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }
    toast.success("Course Section Updated")
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// update a subsection
export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }
    toast.success("Lecture Updated")
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// delete a section
export const deleteSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }
    toast.success("Course Section Deleted")
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    toast.success("Lecture Deleted")
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// fetch all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
  let result = []
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("INSTRUCTOR COURSES API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// delete a course
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
}

// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}
//marks quiz as completed
export const markQuizCompleted = async (data, token) => {
  let result = null;
  console.log("mark complete data", data);
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", QUIZ_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("QUIZ_AS_COMPLETE_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to complete quiz");
    }

    toast.success("Quiz Completed");
    toast.dismiss(toastId);
    result = response.data; // ✅ Return the whole data object
    
  } catch (error) {
    console.log("MARK_Quiz_AS_COMPLETE_API API ERROR............", error);
    toast.error(error.message);
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};


export const getAllUsers = async (token) => {
  try {
    console.log(token);
    alert(token);
    const response = await apiConnector("GET",   GET_USERS_API, {
      Authorization: `Bearer ${token}`,
    });
    
    return response.data?.users;
  } catch (error) {
    console.log("GET_ALL_USERS_ERROR:", error);
    return null;
  }
};



// if quiz present
export const getQuizProgress = async (data, token) => {
  let result = null;
  console.log("mark complete data", data);
  // const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", QUIZ_CHECK_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("QUIZ_ALREADY_COMPLETE_API API RESPONSE............", response);

    if (!response.data.success) {
      return;
      throw new Error(response.data.error || "Failed to complete quiz");
    }

    
    result = response.data; // ✅ Return the whole data object
  } catch (error) {
    console.log("MARK_Quiz_AS_COMPLETE_API API ERROR............", error);
    // toast.error(error.message);
    result = false;
  }
  // toast.dismiss(toastId);
  return result;
};


// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = null
  console.log("mark complete data", data)
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log(
      "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
      response
    )

    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
    toast.error(error.message)
    result = false
  }
  toast.dismiss(toastId)
  return result
}

// create a rating for course
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE RATING API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating")
    }
    toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
    console.log("CREATE RATING API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}

// create quiz
// export const createQuiz = async (data, token) => {
//   console.log("cvbnm,  jjjjjjjjjjjjjjjjj");
//   let result = null
//   const toastId = toast.loading("Creating Quiz...")
//   try {
//     const response = await apiConnector("POST", CREATE_QUIZ_API, data, {
//       Authorization: `Bearer ${token}`,
//     })
//     console.log("CREATE QUIZ API RESPONSE............", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Create Quiz")
//     }
//     toast.success("Quiz Created Successfully")
//     result = response?.data?.data
//   } catch (error) {
//     console.log("CREATE QUIZ API ERROR............", error)
//     toast.error(error.message)
//   }
//   toast.dismiss(toastId)
//   return result
// }


//updating the quiz
// In your courseDetailsAPI.js (or whatever file contains the API functions)

// export const updateQuiz = async (data, token) => {
//   console.log("Updating quiz with data:", data);
//   let result = null;
//   const toastId = toast.loading("Updating Quiz...");
//   try {
//     const response = await apiConnector("POST", UPDATE_QUIZ_API, data, {
//       Authorization: `Bearer ${token}`,
//     });
//     console.log("UPDATE QUIZ API RESPONSE............", response);
//     if (!response?.data?.success) {
//       throw new Error("Could Not Update Quiz");
//     }
//     toast.success("Quiz Updated Successfully");
//     result = response?.data?.data;
//   } catch (error) {
//     console.log("UPDATE QUIZ API ERROR............", error);
//     toast.error(error.message);
//   }
//   toast.dismiss(toastId);
//   return result;
// };


// fetch quiz data by quiz ID
// export const fetchQuizData = async (quizId, token) => {
//   const toastId = toast.loading("Loading Quiz Data...");
//   let result = null;
//   try {
//     const response = await apiConnector("POST", GET_QUIZ_API, { quizId }, {
//       Authorization: `Bearer ${token}`,
//     });
//     console.log("GET QUIZ API RESPONSE............", response);
//     if (!response?.data?.success) {
//       throw new Error("Could Not Fetch Quiz Data");
//     }
//     result = response?.data?.data;
//   } catch (error) {
//     console.log("GET QUIZ API ERROR............", error);
//     toast.error(error.message);
//   }
//   toast.dismiss(toastId);
//   return result;
// };
















// Create a quiz (for questions and options)
export const createQuiz = async (data, token) => {
  let result = null
  const toastId = toast.loading("Creating Quiz...")
  try {
    const response = await apiConnector("POST", CREATE_QUIZ_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Create Quiz")
    }
    toast.success("Quiz Created Successfully")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// Update the quiz (for editing questions, options, or the correct answer)
export const updateQuiz = async (data, token) => {
  let result = null
  const toastId = toast.loading("Updating Quiz...")
  try {
    const response = await apiConnector("POST", UPDATE_QUIZ_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Update Quiz")
    }
    toast.success("Quiz Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// Delete a specific question from the quiz
export const deleteQuizQuestion = async (questionId, quizId, token) => {
  let result = null
  const toastId = toast.loading("Deleting Question...")
  try {
    const response = await apiConnector("POST", DELETE_QUIZ_API, { questionId, quizId }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Question")
    }
    toast.success("Question Deleted Successfully")
    result = response?.data?.updatedQuiz
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// Fetch quiz data by quiz ID (for editing or viewing)
export const getQuizDetails = async (quizId, token) => {
  const toastId = toast.loading("Loading Quiz Data...")
  let result = null
  try {
    const response = await apiConnector("POST", GET_QUIZ_API, { quizId }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Quiz Data")
    }
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// Create a question (inside a quiz)
export const createQuestion = async (data, token) => {
  let result = null
  const toastId = toast.loading("Creating Question...")
  try {
    const response = await apiConnector("POST", CREATE_QUESTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Create Question")
    }
    toast.success("Question Created Successfully")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// Update a question (inside a quiz)
export const updateQuestion = async (data, token) => {
  let result = null
  const toastId = toast.loading("Updating Question...")
  try {
    const response = await apiConnector("POST", UPDATE_QUESTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Update Question")
    }
    toast.success("Question Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// Delete a specific question from the quiz
export const deleteQuestion = async (questionId, token) => {
  let result = null
  const toastId = toast.loading("Deleting Question...")
  try {
    const response = await apiConnector("POST", DELETE_QUESTION_API, { questionId }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Question")
    }
    toast.success("Question Deleted Successfully")
    result = response?.data?.updatedQuiz
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}