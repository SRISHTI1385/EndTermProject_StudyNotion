import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

export default function QuestionModal({
  modalData,
  setModalData,
  add = false,
  edit = false,
  view = false
}) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  // If we're editing or viewing, pre-fill the form with the existing data
  useEffect(() => {
    if (edit || view) {
      setValue("questionText", modalData.questionText)
      setValue("options", modalData.options)
      setValue("correctOption", modalData.correctOption)
    }
  }, [modalData, setValue, edit, view])

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true)
    
    // Add logic for adding or updating the question
    if (add) {
      // Call the API or logic for adding a question
      toast.success("Question added successfully!")
    } else if (edit) {
      // Call the API or logic for editing a question
      toast.success("Question updated successfully!")
    }
    
    setLoading(false)
    setModalData(null) // Close the modal after submission
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{add ? "Add New Question" : edit ? "Edit Question" : "View Question"}</h2>

        {/* Question Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Question Text</label>
            <textarea
              {...register("questionText", { required: true })}
              placeholder="Enter question text"
              disabled={view}
            />
            {errors.questionText && <p className="error">Question is required</p>}
          </div>

          <div>
            <label>Option 1</label>
            <input
              type="text"
              {...register("options.0", { required: true })}
              placeholder="Option 1"
              disabled={view}
            />
            {errors.options?.[0] && <p className="error">Option 1 is required</p>}
          </div>

          <div>
            <label>Option 2</label>
            <input
              type="text"
              {...register("options.1", { required: true })}
              placeholder="Option 2"
              disabled={view}
            />
            {errors.options?.[1] && <p className="error">Option 2 is required</p>}
          </div>

          <div>
            <label>Option 3</label>
            <input
              type="text"
              {...register("options.2", { required: true })}
              placeholder="Option 3"
              disabled={view}
            />
            {errors.options?.[2] && <p className="error">Option 3 is required</p>}
          </div>

          <div>
            <label>Option 4</label>
            <input
              type="text"
              {...register("options.3", { required: true })}
              placeholder="Option 4"
              disabled={view}
            />
            {errors.options?.[3] && <p className="error">Option 4 is required</p>}
          </div>

          <div>
            <label>Correct Option</label>
            <select
              {...register("correctOption", { required: true })}
              disabled={view}
            >
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
              <option value="Option 3">Option 3</option>
              <option value="Option 4">Option 4</option>
            </select>
            {errors.correctOption && <p className="error">Correct option is required</p>}
          </div>

          <button type="submit" disabled={loading || view}>
            {loading ? "Submitting..." : add ? "Add Question" : edit ? "Update Question" : "View Question"}
          </button>
        </form>

        {/* Close Button */}
        <button onClick={() => setModalData(null)} className="close-btn">
          Close
        </button>
      </div>
    </div>
  )
}
