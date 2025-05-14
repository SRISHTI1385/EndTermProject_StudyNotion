import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext, MdEdit, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  updateQuiz,
  getQuizDetails

} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep,setEditCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import NestedView from "./NestedView";

export default function QuizForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

  
  const [quizQuestionsCount, setQuizQuestionsCount] = useState(10); // Default number of questions
const [quizTime, setQuizTime] = useState(60);



  const [quizzes, setQuizzes] = useState([]);

  const [editQuestionId, setEditQuestionId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (course?.quizzes?.length > 0) {
        setLoading(true);
        try {
          const quizPromises = course.quizzes.map(async (quizId) => {
            // Fetch the quiz data by quizId
            const quizData = await getQuizDetails(quizId, token);
            return quizData; // Return the quiz data to set it in state
          });
          
          const quizzesData = await Promise.all(quizPromises);
          setQuizzes(quizzesData); // Set fetched quizzes in state
        } catch (error) {
          toast.error("Failed to fetch quizzes.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuizDetails();
  }, [course, token]);

  const toggleQuestionDetails = (index) => {
    setSelectedQuestionIndex(selectedQuestionIndex === index ? null : index);
  };

//   const renderQuizQuestions = () => {
//     if (quizzes.length > 0) {
//       return quizzes.map((quiz, quizIndex) => (
//         <div key={quizIndex} className="space-y-4">
//           <p className="text-lg font-semibold text-richblack-5">Quiz: {quiz.quizName}</p>
//           {quiz?.questions?.length > 0 ? (
//             quiz.questions.map((question, questionIndex) => (
//               <div key={questionIndex} className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <div className="cursor-pointer text-lg font-semibold text-richblack-5">
//                     {question.questionText}
//                   </div>
//                   <button
//                     className="text-blue-500"
//                     onClick={() => toggleQuestionDetails(questionIndex)}
//                   >
//                     {selectedQuestionIndex === questionIndex ? "Hide" : "Show"} Options
//                   </button>
//                 </div>
//                 {selectedQuestionIndex === questionIndex && (
//                   <div className="space-y-2">
//                     {question.options.map((option, idx) => (
//                       <p key={idx} className="text-sm text-richblack-5">
//                         {option} {question.correctOption === idx && "(Correct)"}
//                       </p>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>No questions available for this quiz.</p>
//           )}
//         </div>
//       ));
//     } else {
//       return <p>No quizzes available for this course.</p>;
//     }
//   };
  

//   useEffect(() => {
//     if (course?.courseContent?.length > 0) {
//       const firstQuestion = course.courseContent[0];
//       setValue("quizName", firstQuestion.questionText);
//       setValue("options", firstQuestion.options);
//       setValue("correctOption", firstQuestion.correctOption);
//     }
//   }, [course?.courseContent, setValue]);

  //   const onSubmit = async (data) => {
  //     window.alert(editQuestionId+" "+course._id);
  //     setLoading(true);
  //     let result;

  //     // Check if in edit mode or create new question
  //     window.alert(course+" "+dispatch);
  //     if (editQuestionId) {
  //       // Update existing question
  //       result = await updateQuestion(
  //         {
  //           questionText: data.quizName,
  //           options: data.options,
  //           correctOption: data.correctOption,
  //           questionId: editQuestionId,
  //           courseId: course._id,
  //         },
  //         token
  //       );
  //     } else {
  //       // Create new question
  //       result = await createQuestion(
  //         {
  //           questionText: data.quizName,
  //           options: data.options,
  //           correctOption: data.correctOption,
  //           courseId: course._id,
  //         },
  //         token
  //       );
  //     }

  //     if (result) {
  //       dispatch(setCourse(result)); // Update course in Redux store
  //       setEditQuestionId(null);
  //       setValue("quizName", "");
  //       setValue("options", ["", "", "", ""]);
  //       setValue("correctOption", "");
  //       toast.success(editQuestionId ? "Question updated!" : "Question added successfully!");
  //     } else {
  //       toast.error("Failed to add or update the question.");
  //     }
  //     setLoading(false);
  //   };


  const renderQuizQuestions = () => {
    if (quizzes.length > 0) {
      return quizzes.map((quiz, quizIndex) => (
        <div key={quizIndex} className="space-y-4">
          <p className="text-lg font-semibold text-richblack-5">
            Quiz: {quiz.quizName}
          </p>
          {quiz?.questions?.length > 0 ? (
            quiz.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="cursor-pointer text-lg font-semibold text-richblack-5">
                    Question {questionIndex + 1}: {question.questionText}
                  </div>
                  <button
                    className="text-blue-500"
                    onClick={() => toggleQuestionDetails(questionIndex)}
                  >
                    {selectedQuestionIndex === questionIndex ? "Hide" : "Show"} Options
                  </button>
                </div>
                {selectedQuestionIndex === questionIndex && (
                  <div className="space-y-2">
                    {question.options.map((option, idx) => (
                      <p key={idx} className="text-sm text-richblack-5">
                        {idx + 1}. {option}{" "}
                        {question.correctOption === idx && "(Correct)"}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No questions available for this quiz.</p>
          )}
        </div>
      ));
    } else {
      return <p>No quizzes available for this course.</p>;
    }
  };
   
  const handleQuizSettingsChange = (e) => {
    const { name, value } = e.target;
    if (name === "quizQuestionsCount") {
      setQuizQuestionsCount(parseInt(value));
    } else if (name === "quizTime") {
      setQuizTime(parseInt(value));
    }
    // You can call an API here to update the quiz settings in the database if needed
    updateQuizSettings({ quizQuestionsCount, quizTime });
  };
  
  // Function to handle quiz settings update (if you need to update the database)
  const updateQuizSettings = async ({ quizQuestionsCount, quizTime }) => {
    // Call the API to update the quiz settings for the current quiz
    // const result = await updateQuizSettingsAPI({
    //   quizQuestionsCount,
    //   quizTime,
    //   courseId: course._id, // Assuming you have the course ID available
    // });
    // if (result) {
    //   toast.success("Quiz settings updated successfully");
    // } else {
    //   toast.error("Failed to update quiz settings");
    // }
  };
  

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    // Get the courseId from the current course state
    const courseId = course._id;

    // Check if a quiz already exists for this course
    const existingQuiz =course.quizzes[0] // Assuming one quiz per course
     
    // window.alert(course.json)
    // window.alert(courseId + " ");
    // window.alert(editQuestionId);
    window.alert("    fxbjk "+ JSON.stringify(course.quizzes[0]));
    alert(existingQuiz);

    if (editQuestionId) {
        window.alert("hiii");
      // If in edit mode, update the existing question
      result = await updateQuestion(
        {
          questionText: data.quizName,
          options: data.options,
          correctOption: data.correctOption,
          questionId: editQuestionId,
          courseId: courseId, // Ensure correct courseId
        },
        token
      );
    } else {
      if (existingQuiz) {
        window.alert("hiiirtyu");
        window.alert(existingQuiz._id);
        window.alert(existingQuiz);
        // If quiz exists for the course, add the new question to it
        result = await addQuestionToExistingQuiz(
          existingQuiz, // Existing quiz ID
          data.quizName,
          data.options,
          data.correctOption,
          courseId
        );
        window.alert("hjk");
        window.alert(result)
      } else {
        window.alert("hiiyyei   "+JSON.stringify(data));
        // If no quiz exists, create a new quiz for the course and add the question
        result = await createNewQuizWithQuestion(
          data.TotalQuestion,
          data.QuizTime,
          data.quizName,
          data.options,
          data.correctOption,
          courseId
          
        );
      }
    }
    window.alert(result+"  afte");

    if (result) {
      // dispatch(setCourse(result))
      // setEditSectionName(null)
      setValue("sectionName", "")
      dispatch(setCourse(result)); // Update course in Redux store
      setEditQuestionId(null);
      setValue("quizName", "");
      setValue("options", ["", "", "", ""]);
      setValue("correctOption", "");
      toast.success(
        editQuestionId ? "Question updated!" : "Question added successfully!"
      );
    } 
    // window.alert("csh");
   if(result==null)
   {
    toast.error("Cannot add more question or some fields is empty");
   }
    setLoading(false);
    window.alert("Ashvjb");
  };

  // Helper function to add a question to an existing quiz
  const addQuestionToExistingQuiz = async (quizId, questionText, options, correctOption, courseId) => {
    const newQuestion = {
      questionText,
      options,
      correctOption,
    };
    alert("hiiiii "+quizId);
    const newQuiz = {
        quizId,
        courseId,
        questions: [
          {
            questionText,
            options,
            correctOption,
          },
        ],
      };
       window.alert("xz bnnooooooooooo")
      return await updateQuiz(newQuiz, token);
    // return await updateQuiz(quizId, { questions: [newQuestion], courseId }, token); // API to update the quiz with new question
    
  };
  
  
  
  

  // Helper function to create a new quiz with the first question
  const createNewQuizWithQuestion = async (
    TotalQuestion,
    QuizTime,
    questionText,
    options,
    correctOption,
    courseId
  ) => {
    const newQuiz = {
      courseId,
      TotalQuestion,
      QuizTime,
      questions: [
        {
          questionText,
          options,
          correctOption,
        },
      ],
    };
   alert("hii"+" "+JSON.stringify(newQuiz));
    return await createQuestion(newQuiz, token); // Assuming you have an API function to create a new quiz
  };

  const cancelEdit = () => {
    window.alert("hii");
    setEditQuestionId(null);
    setValue("quizName", "");
    setValue("options", ["", "", "", ""]);
    setValue("correctOption", "");
  };

  const handleChangeEditQuestion = (
    questionId,
    questionText,
    options,
    correctOption
  ) => {
    window.alert("hye");
    if (editQuestionId === questionId) {
      cancelEdit();
      return;
    }
    setEditQuestionId(questionId);
    setValue("quizName", questionText);
    setValue("options", options);
    setValue("correctOption", correctOption);
  };

  const handleDeleteQuestion = (questionId) => {
    window.alert("i");
    setQuestionToDelete(questionId);
    setShowDeletePopup(true);
  };

  const confirmDeleteQuestion = async () => {
    window.alert("h");
    setLoading(true);
    const result = await deleteQuestion(questionToDelete, course._id, token);
    
    if (result) {
      dispatch(setCourse(result)); // Update course in Redux store
      setShowDeletePopup(false);
      toast.success("Question deleted successfully");
    } else {
      toast.error("Failed to delete question");
    }
    setLoading(false);
  };

  const cancelDeletePopup = () => {
    window.alert("hi");
    setShowDeletePopup(false);
    setQuestionToDelete(null);
  };

  const goToNext = () => {
    window.alert(JSON.stringify(course));
    window.alert(course.quizzes[0].TotalQuestion);
    // window.alert(course.quizzes.TotalQuestion);
    if(course.quizzes[0].questions.length<course.quizzes[0].TotalQuestion)
    {
      window.alert(JSON.stringify(course.quizzes));
      toast.error(`There should be total ${course.quizzes[0].TotalQuestion} Questions`);
      return;
    }
    if (course?.courseContent?.length === 0) {
      toast.error("Please add at least one question");
      return;
    }
    if (
      course?.courseContent?.some((question) =>
        question?.options?.some((option) => !option)
      )
    ) {
      toast.error("Please fill all options for each question");
      return;
    }
    dispatch(setStep(4)); // Proceed to the next step
  };

  const goBack = () => {
    dispatch(setEditCourse(true))
    // window.alert("his"+JSON.stringify(course)+"         fr bb    "+setCourse);
    dispatch(setStep(2));// Go back to the previous step
    // dispatch(setStep(1))
        // dispatch(setEditCourse(true))
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Question Builder
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="quizName">
            Question <sup className="text-pink-200">*</sup>
          </label>
          <div className="flex gap-x-4">
  {/* Number of Questions Input */}
  <div>
    <label htmlFor="quizQuestionsCount" className="text-sm text-richblack-5">
      Number of Questions:
    </label>
    <input
      type="number"
      id="quizQuestionsCount"
      name="quizQuestionsCount"
      value={quizQuestionsCount}
      {...register("TotalQuestion", { required: true })}
      // onChange={(e) => setQuizQuestionsCount(e.target.value)}
      className="form-style w-full"
      min={1}
    />
  </div>

  {/* Quiz Time Input */}
  <div>
    <label htmlFor="quizTime" className="text-sm text-richblack-5">
      Quiz Time (minutes):
    </label>
    <input
      type="number"
      id="quizTime"
      name="quizTime"
      value={quizTime}
      {...register("QuizTime", { required: true })}
      // onChange={(e) => setQuizTime(e.target.value)}
      className="form-style w-full"
      min={1}
    />
  </div>
</div>


          <input
            id="quizName"
            disabled={loading}
            placeholder="Enter your question"
            {...register("quizName", { required: true })}
            className="form-style w-full"
            defaultValue={
              editQuestionId
                ? course?.courseContent?.find(
                    (question) => question._id === editQuestionId
                  )?.questionText
                : ""
            }
          />

          {/* Options */}
          {["Option 1", "Option 2", "Option 3", "Option 4"].map(
            (option, index) => (
              <input
                key={index}
                id={`option-${index + 1}`}
                disabled={loading}
                placeholder={option}
                {...register(`options.${index}`, { required: true })}
                className="form-style w-full"
                defaultValue={
                  editQuestionId
                    ? course?.courseContent?.find(
                        (question) => question._id === editQuestionId
                      )?.options[index]
                    : ""
                }
              />
            )
          )}

          {/* Correct Option */}
          <div className="flex gap-x-2">
            <label className="text-sm text-richblack-5" htmlFor="correctOption">
              Correct Option <sup className="text-pink-200">*</sup>
            </label>
            <select
              id="correctOption"
              {...register("correctOption", { required: true })}
              className="form-style w-full"
              defaultValue={
                editQuestionId
                  ? course?.courseContent?.find(
                      (question) => question._id === editQuestionId
                    )?.correctOption
                  : ""
              }
            >
              <option value="">Select Correct Option</option>
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
              <option value="Option 3">Option 3</option>
              <option value="Option 4">Option 4</option>
            </select>
          </div>

          {errors.quizName || errors.options ? (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              All fields (question, options) are required
            </span>
          ) : null}
        </div>

        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editQuestionId ? "Update Question" : "Add Question"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editQuestionId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
        
      </form>

      {/* Nested Question View */}
      {/* {course?.courseContent?.length > 0 && (
        <NestedView
          items={course?.courseContent}
          handleChangeEditQuestion={handleChangeEditQuestion}
          handleDeleteQuestion={handleDeleteQuestion}
        />
      )} */}

      
       {/* Render Quiz Questions */}
      {renderQuizQuestions()}


      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <p className="text-lg">
              Are you sure you want to delete this question?
            </p>
            <div className="flex gap-x-4 mt-4">
              <button
                onClick={confirmDeleteQuestion}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Confirm
              </button>
              <button
                onClick={cancelDeletePopup}
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Next and Previous Buttons */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
        >
          Back
        </button>

        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  );
}


