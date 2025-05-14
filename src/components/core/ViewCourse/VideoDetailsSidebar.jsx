import React, { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { markQuizCompleted, getQuizProgress } from "../../../services/operations/courseDetailsAPI";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isPresent, setPresent] = useState(true);
  const [isCongratulations, setIsCongratulations] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [timer, setTimer] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(null); // changed to null initially

  const { token } = useSelector((state) => state.auth);
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  const finalQuiz = courseEntireData?.quizzes?.[0];

  useEffect(() => {
    const checkQuizCompletion = async () => {
      const progress = await getQuizProgress(
        {
          courseId,
          quizId: finalQuiz._id,
        },
        token
      );
      if (progress) {
        // alert(JSON.stringify(progress));
        setQuizScore(progress.data.score);
        // alert(typeof progress.data.score+" bj");
        setQuizCompleted(true);
        setPresent(false);
        // alert(quizScore);
      }
    };
    if (finalQuiz && token) checkQuizCompletion();
  }, [finalQuiz, token, courseId]);

  useEffect(() => {
    if (!courseSectionData.length) return;
    const sectionIdx = courseSectionData.findIndex((sec) => sec._id === sectionId);
    const subIdx = courseSectionData[sectionIdx]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    );
    const activeSubId = courseSectionData[sectionIdx]?.subSection[subIdx]?._id;
    setActiveStatus(courseSectionData[sectionIdx]?._id);
    setVideoBarActive(activeSubId);
  }, [courseSectionData, sectionId, subSectionId]);

  useEffect(() => {
    if (isQuizModalOpen && finalQuiz) {
      setTimer(finalQuiz.QuizTime * 60);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsQuizModalOpen(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isQuizModalOpen, finalQuiz]);

  useEffect(() => {
    if (quizCompleted && typeof quizScore === "number") {
      setIsCongratulations(true);
    }
    // alert(quizScore);
  }, [quizCompleted, quizScore]);

  const handleOptionClick = (index) => {
    if (showAnswerFeedback || quizCompleted) return;
    setSelectedOptionIndex(index);

    const correctIndex = finalQuiz.questions[currentQuestionIndex].correctOption;
    const isCorrect = index === correctIndex;
    if (isCorrect) {
      setQuizScore((prev) => (prev !== null ? prev + 1 : 1));
    }

    setShowAnswerFeedback(true);
    setTimeout(() => {
      setSelectedOptionIndex(null);
      setShowAnswerFeedback(false);
      if (currentQuestionIndex < finalQuiz.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setIsQuizModalOpen(false);
        setQuizCompleted(true);
      }
    }, 1000);
  };

  const handleCourseCompletion = async () => {
    setIsCongratulations(false);
    
    // alert("shjs");
    const result = await markQuizCompleted(
      {
        courseId,
        quizId: finalQuiz._id,
        score: quizScore,
      },
      token
    );
    if (result) {
      setQuizCompleted(true);
      const savedScore = result.completedQuizzes.find(q => q.quizId === finalQuiz._id)?.score || quizScore;
      setQuizScore(savedScore);
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between">
            <div
              onClick={() => navigate(`/dashboard/enrolled-courses`)}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="Back"
            >
              <IoIosArrowBack size={30} />
            </div>
            <IconBtn text="Add Review" customClasses="ml-auto" onclick={() => setReviewModal(true)} />
          </div>
          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData.map((course, index) => (
            <div key={index} className="mt-2 cursor-pointer text-sm text-richblack-5">
              <div
                className="flex justify-between bg-richblack-600 px-5 py-4"
                onClick={() => setActiveStatus(course._id)}
              >
                <div className="w-[70%] font-semibold">{course.sectionName}</div>
                <span className={`${activeStatus === course._id ? "rotate-0" : "rotate-180"} transition-all`}>
                  <BsChevronDown />
                </span>
              </div>
              {activeStatus === course._id && (
                <div>
                  {course.subSection.map((topic, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        navigate(`/view-course/${courseEntireData._id}/section/${course._id}/sub-section/${topic._id}`);
                        setVideoBarActive(topic._id);
                      }}
                      className={`flex gap-3 px-5 py-2 ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      }`}
                    >
                      <input type="checkbox" checked={completedLectures.includes(topic._id)} onChange={() => {}} />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {finalQuiz && (
          <div className="mt-6 border-t border-richblack-600 pt-3">
            <div className="flex items-center gap-3 px-5 py-3">
              <input type="checkbox" checked={quizCompleted} readOnly />
              <div
                className="cursor-pointer hover:bg-richblack-900 text-richblack-5 px-3 py-2 rounded"
                onClick={() => {
                  if (!quizCompleted) {
                    setIsQuizModalOpen(true);
                    setCurrentQuestionIndex(0);
                    setQuizScore(0);
                  }
                }}
              >
                Final Quiz
              </div>
            </div>
            {quizCompleted && (
              <div className="px-5 text-sm text-green-400">
                You scored {quizScore} / {finalQuiz.questions.length}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      {isQuizModalOpen && finalQuiz && !quizCompleted && (
  <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex justify-center items-center">
    <div className="bg-richblack-900 p-6 rounded-lg w-full max-w-md shadow-2xl z-[10000]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">
          Question {currentQuestionIndex + 1}
        </h2>
        <p className="text-sm text-white">
          ⏱ {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
        </p>
      </div>
      <p className="mb-3 font-medium text-white">
        {finalQuiz.questions[currentQuestionIndex].questionText}
      </p>
      <div className="flex flex-col gap-2">
        {finalQuiz.questions[currentQuestionIndex].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(idx)}
            className="border p-2 rounded text-white w-full transition-colors duration-300"
            style={{
              backgroundColor: showAnswerFeedback
                ? idx === finalQuiz.questions[currentQuestionIndex].correctOption
                  ? "#22c55e"
                  : idx === selectedOptionIndex
                  ? "#ef4444"
                  : "#1f2937"
                : "#374151",
            }}
            disabled={showAnswerFeedback}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        onClick={() => setIsQuizModalOpen(false)}
        className="mt-4 bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
      >
        Exit Quiz
      </button>
    </div>
  </div>
)}


{quizCompleted && isPresent && isCongratulations && typeof quizScore === "number" && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg text-center"
         style={{ width: "384px", height: "104px" }}>
      <div className="flex flex-col justify-center h-full">
        <p className="text-lg font-semibold mb-4">
          🎉 Congratulations! You completed the quiz with a score of {quizScore}
        </p>
        <button
          onClick={handleCourseCompletion}
          className="mt-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Mark Course as Completed
        </button>
      </div>
    </div>
  </div>
)}


    </>
  );
}




// // import { useDispatch, useSelector } from "react-redux";
// // import { markQuizCompleted } from "../../../slices/viewCourseSlice";

// //  import { useEffect, useState } from "react";
// import React, { useEffect, useRef, useState } from "react"

// import { markQuizCompleted } from "../../../services/operations/courseDetailsAPI"
//  import { BsChevronDown } from "react-icons/bs";
//  import { IoIosArrowBack } from "react-icons/io";
//  import { useSelector, useDispatch } from "react-redux";
//  import { useLocation, useNavigate, useParams } from "react-router-dom";
//  import IconBtn from "../../common/IconBtn";
//  import {
//    setQuizScore,
//    markQuizAsComplete,
//    setQuizData,
//  } from "../../../slices/viewCourseSlice";
 
//  export default function VideoDetailsSidebar({ setReviewModal }) {
//    const [activeStatus, setActiveStatus] = useState("");
//    const [videoBarActive, setVideoBarActive] = useState("");
//    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
//    const [iscongratulations, setIsCongratulations] = useState(true);
//    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
//    const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
//    const [timer, setTimer] = useState(0);
//    const { token } = useSelector((state) => state.auth)
//    const navigate = useNavigate();
//    const location = useLocation();
//   //  const { sectionId, subSectionId } = useParams();
//    const dispatch = useDispatch();
//    const { courseId, sectionId, subSectionId } = useParams()
//   //  dispatch(markQuizCompleted({ completed: true }));
// //  window.alert(JSON.stringify(markQuizCompleted));
//    const {
//      courseSectionData,
//      courseEntireData,
//      totalNoOfLectures,
//      completedLectures,
//      quiz,
//    } = useSelector((state) => state.viewCourse);

//    const finalQuiz = courseEntireData?.quizzes?.[0];
//   //  window.alert(JSON.stringify(completedLectures));
  
  
//    useEffect(() => {
//      if (!courseSectionData.length) return;
//      const currentSectionIndx = courseSectionData.findIndex(
//        (data) => data._id === sectionId
//      );
//      const currentSubSectionIndx = courseSectionData[currentSectionIndx]?.subSection.findIndex(
//        (data) => data._id === subSectionId
//      );
//      const activeSubSectionId =
//        courseSectionData[currentSectionIndx]?.subSection[currentSubSectionIndx]?._id;
//      setActiveStatus(courseSectionData[currentSectionIndx]?._id);
//      setVideoBarActive(activeSubSectionId);
//    }, [courseSectionData, courseEntireData, location.pathname]);
 
//    useEffect(() => {
//      if (isQuizModalOpen && finalQuiz) {
//       window.alert(JSON.stringify(quiz));
//       const s=quiz.completed;
//       //  dispatch(
//       //    setQuizData({ quizId: finalQuiz._id, completed: false, score: 0 })
//       //  );
//        window.alert(s);
//        setTimer(finalQuiz.QuizTime * 60);
//        const interval = setInterval(() => {
//          setTimer((prev) => {
//            if (prev <= 1) {
//              clearInterval(interval);
//              dispatch(markQuizAsComplete({ completed: true }));
//              setIsQuizModalOpen(false);
//              return 0;
//            }
//            return prev - 1;
//          });
//        }, 1000);
//        window.alert(JSON.stringify(quiz)+" hhh");
//        return () => clearInterval(interval);
//      }
//      else
//      {
//       window.alert(JSON.stringify(quiz));
//      }
//    }, [isQuizModalOpen, finalQuiz, dispatch]);
 
//    const handleOptionClick = (index) => {
//      if (showAnswerFeedback || quiz.completed) return;
//      setSelectedOptionIndex(index);
//      const correctIndex =
//        finalQuiz.questions[currentQuestionIndex].correctOption;
 
//      let updatedScore = quiz.score;
 
//      if (index === correctIndex) {
//        updatedScore += 1;
//      }
 
//      dispatch(setQuizScore({ score: updatedScore }));
    
//      setShowAnswerFeedback(true);
 
//      setTimeout(() => {
//        setSelectedOptionIndex(null);
//        setShowAnswerFeedback(false);
      
//        if (currentQuestionIndex < finalQuiz.questions.length - 1) {
//          setCurrentQuestionIndex((prev) => prev + 1);
//        } else {
//         window.alert(finalQuiz.questions.length - 1)
//        window.alert(currentQuestionIndex)
//          dispatch(markQuizAsComplete({ completed: true }));
//          window.alert(JSON.stringify(quiz));
//          setIsQuizModalOpen(false);
//          window.alert(JSON.stringify(quiz));
//        }
//      }, 1000);
     
//    };



//      const handleCourseCompletion = async () => {
//         //  setLoading(true)
//          setIsCongratulations(false);
//          window.alert(finalQuiz)
//          const res = await markQuizCompleted(
//           {
//             courseId: courseId,
//             quizId: finalQuiz._id,   // Assuming `quiz` is from Redux
//             score: quiz.score,
//           },
//           token
//         );
      
//         if (res) {
  
//           dispatch(
//             setQuizData({ quizId: finalQuiz._id, completed: true, score: quiz.score })
//           );
//           window.alert(JSON.stringify(quiz));
//           dispatch(markQuizAsComplete({ completed: true }));
//         }
      
//         // setLoading(false);
//       };
     
//     // setIsCourseCompleted(true);        // mark course as completed
//     // setIsQuizModalOpen(false);         // close quiz modal
//     // setIsQuizCompleted(false);
//     // setIsCourseCompleted(true);
//     // setIsQuizModalOpen(false); // Close quiz modal
//     // You can update the checkbox state here by modifying the course data (like `completedLectures`)

 
//    return (
//      <>
//        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
//          <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
//            <div className="flex w-full items-center justify-between">
//              <div
//                onClick={() => navigate(`/dashboard/enrolled-courses`)}
//                className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
//                title="back"
//              >
//                <IoIosArrowBack size={30} />
//              </div>
//              <IconBtn
//                text="Add Review"
//                customClasses="ml-auto"
//                onclick={() => setReviewModal(true)}
//              />
//            </div>
//            <div className="flex flex-col">
//              <p>{courseEntireData?.courseName}</p>
//              <p className="text-sm font-semibold text-richblack-500">
//                {completedLectures?.length} / {totalNoOfLectures}
//              </p>
//            </div>
//          </div>
 
//          <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
//            {courseSectionData.map((course, index) => (
//              <div
//                className="mt-2 cursor-pointer text-sm text-richblack-5"
//                onClick={() => setActiveStatus(course?._id)}
//                key={index}
//              >
//                <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
//                  <div className="w-[70%] font-semibold">{course?.sectionName}</div>
//                  <div className="flex items-center gap-3">
//                    <span
//                      className={`${
//                        activeStatus === course?._id ? "rotate-0" : "rotate-180"
//                      } transition-all duration-500`}
//                    >
//                      <BsChevronDown />
//                    </span>
//                  </div>
//                </div>
//                {activeStatus === course?._id && (
//                  <div className="transition-[height] duration-500 ease-in-out">
//                    {course.subSection.map((topic, i) => (
//                      <div
//                        className={`flex gap-3 px-5 py-2 ${
//                          videoBarActive === topic._id
//                            ? "bg-yellow-200 font-semibold text-richblack-800"
//                            : "hover:bg-richblack-900"
//                        }`}
//                        key={i}
//                        onClick={() => {
//                          navigate(
//                            `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
//                          );
//                          setVideoBarActive(topic._id);
//                        }}
//                      >
//                        <input
//                          type="checkbox"
//                          checked={completedLectures.includes(topic?._id)}
//                          onChange={() => {}}
//                        />
//                        {topic.title}
//                      </div>
//                    ))}
//                  </div>
//                )}
//              </div>
//            ))}
//          </div>
 
//          {finalQuiz && (
//            <div className="mt-6 border-t border-richblack-600 pt-3">
//              <div className="flex items-center gap-3 px-5 py-3">
//                <input
//                  type="checkbox"
//                  checked={quiz.completed}
//                  className="cursor-default"
//                />
//                <div
//                  className="cursor-pointer hover:bg-richblack-900 text-richblack-5 px-3 py-2 rounded"
//                  onClick={() => {
//                    if (!quiz.completed) {
//                      setIsQuizModalOpen(true);
//                    }
//                  }}
//                >
//                  Final Quiz
//                </div>
//              </div>
//              {quiz.completed && (
//                <div className="px-5 text-sm text-green-400">
//                  You scored {quiz.score} / {finalQuiz.questions.length}
//                </div>
//              )}
//            </div>
//          )}
//        </div>
 
//        {/* Quiz Modal */}
//        {isQuizModalOpen && finalQuiz && !quiz.completed && (
//          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//            <div className="bg-richblack-800 p-6 rounded-lg max-w-md w-full">
//              <div className="flex justify-between items-center mb-4">
//                <h2 className="text-lg font-bold text-white">
//                  Question {currentQuestionIndex + 1}
//                </h2>
//                <p className="text-sm text-red-500">
//                  ⏱ {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
//                </p>
//              </div>
//              <p className="mb-3 font-medium text-white">
//                {finalQuiz.questions[currentQuestionIndex].questionText}
//              </p>
//              <div className="flex flex-col gap-2">
//                {finalQuiz.questions[currentQuestionIndex].options.map(
//                  (opt, idx) => (
//                    <button
//                      key={idx}
//                      onClick={() => handleOptionClick(idx)}
//                      className="border p-2 rounded text-white w-full transition-colors duration-300"
//                      style={{
//                        backgroundColor: showAnswerFeedback
//                          ? idx ===
//                            finalQuiz.questions[currentQuestionIndex].correctOption
//                            ? "#22c55e"
//                            : idx === selectedOptionIndex
//                            ? "#ef4444"
//                            : "#1f2937"
//                          : "#374151",
//                      }}
//                      disabled={showAnswerFeedback}
//                    >
//                      {opt}
//                    </button>
//                  )
//                )}
//              </div>
//              <button
//                onClick={() => setIsQuizModalOpen(false)}
//                className="mt-4 bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
//              >
//                Exit Quiz
//              </button>
//            </div>
//          </div>
//        )}
//         {quiz.completed && iscongratulations && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//     <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg w-full max-w-md text-center">
//       <p className="text-lg font-semibold mb-2">
//         🎉 Congratulations! You completed the quiz with a score of {quiz.score}
//       </p>
//       <button
//         onClick={handleCourseCompletion}
//         className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
//       >
//         Mark Course as Completed
//       </button>
//     </div>
//   </div>
// )}
       
//      </>
//    );
//  }
 

 





// import { useEffect, useState } from "react";
// import { BsChevronDown } from "react-icons/bs";
// import { IoIosArrowBack } from "react-icons/io";
// import { useSelector } from "react-redux";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import IconBtn from "../../common/IconBtn";

// export default function VideoDetailsSidebar({ setReviewModal }) {
//   const [activeStatus, setActiveStatus] = useState("");
//   const [videoBarActive, setVideoBarActive] = useState("");
//   const [quizScore, setQuizScore] = useState(0); // Track the score
//   const [isQuizCompleted, setIsQuizCompleted] = useState(false);
//   const [isCourseCompleted, setIsCourseCompleted] = useState(false);
//   const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
//   const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
//   const [timer, setTimer] = useState(0);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { sectionId, subSectionId } = useParams();

//   const {
//     courseSectionData,
//     courseEntireData,
//     totalNoOfLectures,
//     completedLectures,
//     quiz,
//   } = useSelector((state) => state.viewCourse);


//   const viewCourse = useSelector((state) => state.viewCourse);

  
//     window.alert(JSON.stringify(viewCourse)); // Pretty-prints the object

//  window.alert("gg");

//   const finalQuiz = courseEntireData?.quizzes?.[0];

//   useEffect(() => {
//     if (!courseSectionData.length) return;
//     const currentSectionIndx = courseSectionData.findIndex(
//       (data) => data._id === sectionId
//     );
//     const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.subSection.findIndex(
//       (data) => data._id === subSectionId
//     );
//     const activeSubSectionId = courseSectionData[currentSectionIndx]?.subSection?.[currentSubSectionIndx]?._id;
//     setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
//     setVideoBarActive(activeSubSectionId);
//   }, [courseSectionData, courseEntireData, location.pathname]);

//   useEffect(() => {
//     if (isQuizModalOpen && finalQuiz) {
//       setTimer(finalQuiz.QuizTime * 60);
//       const interval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             setIsQuizModalOpen(false);
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [isQuizModalOpen]);

//   const handleOptionClick = (index) => {
//     if (showAnswerFeedback) return; // Prevent clicking after answer feedback
//     setSelectedOptionIndex(index);
//     const correctIndex = finalQuiz.questions[currentQuestionIndex].correctOption;
    
//     // Check if the selected option is correct and update the score
//     if (index === correctIndex) {
//       setQuizScore((prev) => prev + 1);
//     }
//     window.alert(index);
//     window.alert(correctIndex);
    
//     setShowAnswerFeedback(true);

//     // Give feedback for the selected answer after a short delay
//     setTimeout(() => {
//       setSelectedOptionIndex(null);
//       setShowAnswerFeedback(false);
//       if (currentQuestionIndex < finalQuiz.questions.length - 1) {
//         setCurrentQuestionIndex((prev) => prev + 1);
//       } else {
//         setIsQuizModalOpen(false);
//         setIsQuizCompleted(true);
//       }
//     }, 1000);
//   };

//   const handleCourseCompletion = () => {
//     setIsCourseCompleted(true);        // mark course as completed
//     // setIsQuizModalOpen(false);         // close quiz modal
//     setIsQuizCompleted(false);
//     // setIsCourseCompleted(true);
//     // setIsQuizModalOpen(false); // Close quiz modal
//     // You can update the checkbox state here by modifying the course data (like `completedLectures`)
//   };

//   return (
//     <>
//       <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
//         <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
//           <div className="flex w-full items-center justify-between">
//             <div
//               onClick={() => navigate(`/dashboard/enrolled-courses`)}
//               className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
//               title="back"
//             >
//               <IoIosArrowBack size={30} />
//             </div>
//             <IconBtn
//               text="Add Review"
//               customClasses="ml-auto"
//               onclick={() => setReviewModal(true)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <p>{courseEntireData?.courseName}</p>
//             <p className="text-sm font-semibold text-richblack-500">
//               {completedLectures?.length} / {totalNoOfLectures}
//             </p>
//           </div>
//         </div>

//         <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
//           {courseSectionData.map((course, index) => (
//             <div
//               className="mt-2 cursor-pointer text-sm text-richblack-5"
//               onClick={() => setActiveStatus(course?._id)}
//               key={index}
//             >
//               <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
//                 <div className="w-[70%] font-semibold">{course?.sectionName}</div>
//                 <div className="flex items-center gap-3">
//                   <span
//                     className={`${
//                       activeStatus === course?._id ? "rotate-0" : "rotate-180"
//                     } transition-all duration-500`}
//                   >
//                     <BsChevronDown />
//                   </span>
//                 </div>
//               </div>
//               {activeStatus === course?._id && (
//                 <div className="transition-[height] duration-500 ease-in-out">
//                   {course.subSection.map((topic, i) => (
//                     <div
//                       className={`flex gap-3 px-5 py-2 ${
//                         videoBarActive === topic._id
//                           ? "bg-yellow-200 font-semibold text-richblack-800"
//                           : "hover:bg-richblack-900"
//                       }`}
//                       key={i}
//                       onClick={() => {
//                         navigate(
//                           `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
//                         );
//                         setVideoBarActive(topic._id);
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={completedLectures.includes(topic?._id) || isCourseCompleted}
//                         onChange={() => {}}
//                       />
//                       {topic.title}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {finalQuiz && (
//           <div className="mt-6 border-t border-richblack-600 pt-3">
//             {/* <p className="px-5 text-richblack-400 text-xs mb-1">Final Quiz</p> */}
//             <div className="flex items-center gap-3 px-5 py-3">
//               <input
//                  type="checkbox"
//                  checked={isCourseCompleted} 
                
//                 className="cursor-default"
//               />
//               <div
//                 className="cursor-pointer hover:bg-richblack-900 text-richblack-5 px-3 py-2 rounded"
//                 onClick={() => setIsQuizModalOpen(true)}
//               >
//                 Final Quiz
//               </div>
//             </div>
//             {isCourseCompleted && (
//       <div className="px-5 text-sm text-green-400">
//        You scored {quizScore} / {finalQuiz.questions.length}
//       </div>
//     )}
//           </div>
//         )}
//       </div>

//       {/* Quiz Modal */}
//       {isQuizModalOpen && finalQuiz && !isCourseCompleted &&(
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-richblack-800 p-6 rounded-lg max-w-md w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold text-white">
//                 Question {currentQuestionIndex + 1}
//               </h2>
//               <p className="text-sm text-red-600">
//                 ⏱ {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
//               </p>
//             </div>
//             <p className="mb-3 font-medium text-white">
//               {finalQuiz.questions[currentQuestionIndex].questionText}
//             </p>
//             <div className="flex flex-col gap-2">
//             {finalQuiz.questions[currentQuestionIndex].options.map((opt, idx) => (
//   <button
 
//   key={idx}
//   onClick={() => handleOptionClick(idx)}
//   className="border p-2 rounded text-white w-full transition-colors duration-300"
//   style={{
//     backgroundColor: showAnswerFeedback
//       ? idx === finalQuiz.questions[currentQuestionIndex].correctOption
//         ? "#22c55e" // Tailwind green-500
//         : idx === selectedOptionIndex
//         ? "#ef4444" // Tailwind red-500
//         : "#1f2937" // Tailwind gray-800 / richblack-600 fallback
//       : "#374151", // Tailwind gray-700 / richblack-700 fallback
//   }}
//   disabled={showAnswerFeedback}
// >
//   {opt}
// </button>

// ))}

//             </div>
//             <button
//               onClick={() => setIsQuizModalOpen(false)}
//               className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
//             >
//               Exit Quiz
//             </button>
//           </div>
//         </div>
//       )}

// {isQuizCompleted && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//     <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg w-full max-w-md text-center">
//       <p className="text-lg font-semibold mb-2">
//         🎉 Congratulations! You completed the quiz with a score of {quizScore}
//       </p>
//       <button
//         onClick={handleCourseCompletion}
//         className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
//       >
//         Mark Course as Completed
//       </button>
//     </div>
//   </div>
// )}

//     </>
//   );
// }
