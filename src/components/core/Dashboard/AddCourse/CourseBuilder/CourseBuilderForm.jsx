import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI"
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)
  const dispatch = useDispatch()

  // handle form submission
  const onSubmit = async (data) => {
    // console.log(data)
    setLoading(true)

    let result

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      )
      // console.log("edit", result)
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      )
    }
    if (result) {
      // console.log("section result", result)
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    // window.alert(editSectionName)
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }
  
    
    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    // dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editSectionName && (
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
      {course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}
      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}

// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { toast } from "react-hot-toast"
// import { IoAddCircleOutline } from "react-icons/io5"
// import { MdNavigateNext } from "react-icons/md"
// import { useDispatch, useSelector } from "react-redux"

// import {
//   createSection,
//   updateSection,
//   // Add createQuiz here
// } from "../../../../../services/operations/courseDetailsAPI"
// import {
//   setCourse,
//   setStep,
// } from "../../../../../slices/courseSlice"
// import IconBtn from "../../../../common/IconBtn"
// import NestedView from "./NestedView"


// export default function CourseBuilderForm() {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm()
//   const [editSectionName, setEditSectionName] = useState(null)
//   const { course } = useSelector((state) => state.course)
//   const { token } = useSelector((state) => state.auth)
//   const [loading, setLoading] = useState(false)
  
//   const dispatch = useDispatch()

//   // Handle form submission for creating or editing sections
//   const onSubmit = async (data) => {
//     setLoading(true)

//     let result

//     if (editSectionName) {
//       // If in edit mode, update the section
//       result = await updateSection(
//         {
//           sectionName: data.sectionName,
//           sectionId: editSectionName,
//           courseId: course._id,
//         },
//         token
//       )
//     } else {
//       // If not in edit mode, create a new section
//       result = await createSection(
//         {
//           sectionName: data.sectionName,
//           courseId: course._id,
//         },
//         token
//       )
//     }

//     if (result) {
//       dispatch(setCourse(result))
//       setEditSectionName(null) // Reset edit mode
//       setValue("sectionName", "") // Clear input
//     }
//     setLoading(false)
//   }

//   // Cancel edit mode and reset the form
//   const cancelEdit = () => {
//     setEditSectionName(null)
//     setValue("sectionName", "")
//   }

//   // Handle click to edit an existing section
//   const handleChangeEditSectionName = (sectionId, sectionName) => {
//     if (editSectionName === sectionId) {
//       cancelEdit()
//       return
//     }
//     setEditSectionName(sectionId)
//     setValue("sectionName", sectionName)
//   }

//   // Proceed to next step
//   const goToNext = () => {
//     window.alert("ff");
//     if (course.courseContent.length === 0) {
//       toast.error("Please add at least one section")
//       return
//     }
//     if (
//       course.courseContent.some((section) => section.subSection.length === 0)
//     ) {
//       toast.error("Please add at least one lecture in each section")
//       return
//     }
//     window.alert("ff");
//     dispatch(setStep(3))
//   }

//   // Go back to previous step
//   const goBack = () => {
//     dispatch(setStep(1))
//   }

//   return (
//     <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
//       <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      
//       {/* Section Form */}
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="flex flex-col space-y-2">
//           <label className="text-sm text-richblack-5" htmlFor="sectionName">
//             Section Name <sup className="text-pink-200">*</sup>
//           </label>
//           <input
//             id="sectionName"
//             disabled={loading}
//             placeholder="Add a section to build your course"
//             {...register("sectionName", { required: true })}
//             className="form-style w-full"
//             defaultValue={editSectionName ? course.courseContent.find(section => section._id === editSectionName)?.sectionName : ""}
//           />
//           {errors.sectionName && (
//             <span className="ml-2 text-xs tracking-wide text-pink-200">
//               Section name is required
//             </span>
//           )}
//         </div>
//         <div className="flex items-end gap-x-4">
//           <IconBtn
//             type="submit"
//             disabled={loading}
//             text={editSectionName ? "Edit Section Name" : "Create Section"}
//             outline={true}
//           >
//             <IoAddCircleOutline size={20} className="text-yellow-50" />
//           </IconBtn>
//           {editSectionName && (
//             <button
//               type="button"
//               onClick={cancelEdit}
//               className="text-sm text-richblack-300 underline"
//             >
//               Cancel Edit
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Nested Section View */}
      //  {course.courseContent.length > 0 && (
      //   <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      // )}

//       {/* Next Prev Button */}
//       <div className="flex justify-end gap-x-3">
//         <button
//           onClick={goBack}
//           className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
//         >
//           Back
//         </button>

//         {editSectionName ? (
//           <>
//             <button
//               onClick={cancelEdit}
//               disabled={loading}
//               className="flex items-center gap-x-2 rounded-md bg-transparent text-sm font-semibold text-richblack-500"
//             >
//               Continue Without Saving
//             </button>
//             <IconBtn disabled={loading} text="Save & Continue" onclick={goToNext}>
//               <MdNavigateNext />
//             </IconBtn>
//           </>
//         ) : (
//           <IconBtn disabled={loading} text="Next" onclick={goToNext}>
//             <MdNavigateNext />
//           </IconBtn>
//         )}
//       </div>
//     </div>
//   )
// }




































// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { toast } from "react-hot-toast"
// import { IoAddCircleOutline } from "react-icons/io5"
// import { MdNavigateNext } from "react-icons/md"
// import { useDispatch, useSelector } from "react-redux"

// import {
//   createSection,
//   updateSection,
//   // Add createQuiz here
// } from "../../../../../services/operations/courseDetailsAPI"
// import {
//   setCourse,
//   setEditCourse,
//   setStep,
// } from "../../../../../slices/courseSlice"
// import IconBtn from "../../../../common/IconBtn"
// import NestedView from "./NestedView"

// export default function CourseBuilderForm() {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm()

//   const { course } = useSelector((state) => state.course)
//   const { token } = useSelector((state) => state.auth)
//   const [loading, setLoading] = useState(false)
//   const [editSectionName, setEditSectionName] = useState(null)
//   // const [quizData, setQuizData] = useState({ title: "", description: "" })  // New state for quiz data
//   const dispatch = useDispatch()

//   // handle form submission for creating sections
//   const onSubmit = async (data) => {
//     setLoading(true)

//     let result

//     if (editSectionName) {
//       result = await updateSection(
//         {
//           sectionName: data.sectionName,
//           sectionId: editSectionName,
//           courseId: course._id,
//         },
//         token
//       )
//     } else {
//       result = await createSection(
//         {
//           sectionName: data.sectionName,
//           courseId: course._id,
//         },
//         token
//       )
//     }

//     if (result) {
//       dispatch(setCourse(result))
//       setEditSectionName(null)
//       setValue("sectionName", "")
//     }
//     setLoading(false)
//   }

  

   

//   const cancelEdit = () => {
//     setEditSectionName(null)
//     setValue("sectionName", "")
//   }

//   const handleChangeEditSectionName = (sectionId, sectionName) => {
//     if (editSectionName === sectionId) {
//       cancelEdit()
//       return
//     }
//     setEditSectionName(sectionId)
//     setValue("sectionName", sectionName)
//   }

//   const goToNext = () => {
//     if (course.courseContent.length === 0) {
//       toast.error("Please add atleast one section")
//       return
//     }
//     if (
//       course.courseContent.some((section) => section.subSection.length === 0)
//     ) {
//       toast.error("Please add atleast one lecture in each section")
//       return
//     }
//     dispatch(setStep(3))
//   }

//   const goBack = () => {
//     dispatch(setStep(1))
//     dispatch(setEditCourse(true))
//   }

//   return (
//     <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
//       <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      
//       {/* Section Form */}
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="flex flex-col space-y-2">
//           <label className="text-sm text-richblack-5" htmlFor="sectionName">
//             Section Name <sup className="text-pink-200">*</sup>
//           </label>
//           <input
//             id="sectionName"
//             disabled={loading}
//             placeholder="Add a section to build your course"
//             {...register("sectionName", { required: true })}
//             className="form-style w-full"
//           />
//           {errors.sectionName && (
//             <span className="ml-2 text-xs tracking-wide text-pink-200">
//               Section name is required
//             </span>
//           )}
//         </div>
//         <div className="flex items-end gap-x-4">
//           <IconBtn
//             type="submit"
//             disabled={loading}
//             text={editSectionName ? "Edit Section Name" : "Create Section"}
//             outline={true}
//           >
//             <IoAddCircleOutline size={20} className="text-yellow-50" />
//           </IconBtn>
//           {editSectionName && (
//             <button
//               type="button"
//               onClick={cancelEdit}
//               className="text-sm text-richblack-300 underline"
//             >
//               Cancel Edit
//             </button>
//           )}
//         </div>
//       </form>

     

//       {/* Nested Section View */}
//       {course.courseContent.length > 0 && (
//         <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
//       )}

//       {/* Next Prev Button */}
//       <div className="flex justify-end gap-x-3">
//         <button
//           onClick={goBack}
//           className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
//         >
//           Back
//         </button>
        
//         <IconBtn disabled={loading} text="Next" onclick={goToNext}>
//           <MdNavigateNext />
//         </IconBtn>
//       </div>
//     </div>

//   )
// }
