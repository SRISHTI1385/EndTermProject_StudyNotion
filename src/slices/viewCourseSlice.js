import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseSectionData: [],
  courseEntireData: [],
  completedLectures: [],
  totalNoOfLectures: 0,
  quiz: { // Single quiz object now, instead of an array
    quizId: null,
    completed: false,
    score: 0,
  },
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload;
    },
    setEntireCourseData: (state, action) => {
      state.courseEntireData = action.payload;
    },
    setTotalNoOfLectures: (state, action) => {
      state.totalNoOfLectures = action.payload;
    },
    setCompletedLectures: (state, action) => {
      state.completedLectures = action.payload;
    },
    updateCompletedLectures: (state, action) => {
      state.completedLectures = [...state.completedLectures, action.payload];
    },
    setQuizData: (state, action) => {
      state.quiz = action.payload; // Set the quiz data (quizId, completed, score)
    },
   

    setQuizScore: (state, action) => {
      const { score } = action.payload;
      state.quiz = {
        ...state.quiz,
        score,
      };
    },
    
    markQuizAsComplete: (state, action) => {
      state.quiz = {
        ...state.quiz,
        completed: true,
      };
    },
    
  },
});

export const {
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
  setCompletedLectures,
  updateCompletedLectures,
  setQuizData,
  setQuizScore,
  markQuizAsComplete,
} = viewCourseSlice.actions;




// export default viewCourseSlice.reducer;

// const initialState = {
//   courseSectionData: [],
//   courseEntireData: [],
//   completedLectures: [],
//   totalNoOfLectures: 0,
// }

// const viewCourseSlice = createSlice({
//   name: "viewCourse",
//   initialState,
//   reducers: {
//     setCourseSectionData: (state, action) => {
//       state.courseSectionData = action.payload
//     },
//     setEntireCourseData: (state, action) => {
//       state.courseEntireData = action.payload
//     },
//     setTotalNoOfLectures: (state, action) => {
//       state.totalNoOfLectures = action.payload
//     },
//     setCompletedLectures: (state, action) => {
//       state.completedLectures = action.payload
//     },
//     updateCompletedLectures: (state, action) => {
//       state.completedLectures = [...state.completedLectures, action.payload]
//     },
//   },
// })

// export const {
//   setCourseSectionData,
//   setEntireCourseData,
//   setTotalNoOfLectures,
//   setCompletedLectures,
//   updateCompletedLectures,
// } = viewCourseSlice.actions

export default viewCourseSlice.reducer