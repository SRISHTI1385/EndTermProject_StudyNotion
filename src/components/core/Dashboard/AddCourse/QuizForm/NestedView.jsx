import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { MdEdit, MdDelete } from "react-icons/md"
import { FaPlus } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"

import {
  deleteQuestion,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import QuestionModal from "./QuestionModal"  // Assuming you have a modal to add/edit questions

export default function NestedView({ handleChangeEditQuestion }) {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  
  // States for managing modal visibility
  const [addQuestion, setAddQuestion] = useState(false)
  const [viewQuestion, setViewQuestion] = useState(null)
  const [editQuestion, setEditQuestion] = useState(null)
  
  // State for handling the confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  // Handle deleting a question
  const handleDeleteQuestion = async (questionId) => {
    const result = await deleteQuestion({
      questionId,
      courseId: course._id,
      token,
    })
    if (result) {
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  }

  return (
    <>
      <div
        className="rounded-lg bg-richblack-700 p-6 px-8"
        id="nestedViewContainer"
      >
        {course?.courseContent?.map((section) => (
          <details key={section._id} open>
            {/* Section Dropdown */}
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
                <AiFillCaretDown className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">
                  {section.sectionName}
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  onClick={() => handleChangeEditQuestion(section._id, section.sectionName)}
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the quiz questions in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteQuestion(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <MdDelete className="text-xl text-richblack-300" />
                </button>
                <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className="text-xl text-richblack-300" />
              </div>
            </summary>
            <div className="px-6 pb-4">
              {/* Render All Questions Within the Section */}
              {section.questions.map((question) => (
                <div
                  key={question._id}
                  onClick={() => setViewQuestion(question)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2">
                    <AiFillCaretDown className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {question.questionText}
                    </p>
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3"
                  >
                    <button
                      onClick={() => setEditQuestion(question)}
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Question?",
                          text2: "This question and its options will be deleted.",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteQuestion(question._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <MdDelete className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}
              {/* Add New Question to Section */}
              <button
                onClick={() => setAddQuestion(true)}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <FaPlus className="text-lg" />
                <p>Add Question</p>
              </button>
            </div>
          </details>
        ))}
      </div>
      {/* Modal Display */}
      {addQuestion ? (
        <QuestionModal
          modalData={addQuestion}
          setModalData={setAddQuestion}
          add={true}
        />
      ) : viewQuestion ? (
        <QuestionModal
          modalData={viewQuestion}
          setModalData={setViewQuestion}
          view={true}
        />
      ) : editQuestion ? (
        <QuestionModal
          modalData={editQuestion}
          setModalData={setEditQuestion}
          edit={true}
        />
      ) : (
        <></>
      )}
      {/* Confirmation Modal */}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}
    </>
  )
}
