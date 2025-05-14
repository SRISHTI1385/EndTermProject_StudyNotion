import React, { useState, useEffect } from "react";

export default function QuizModal({ quizData, onClose, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(quizData?.QuizTime * 60 || 0);
  const currentQuestion = quizData?.questions?.[currentQuestionIndex];
const { courseId, sectionId, subSectionId } = useParams()
  useEffect(() => {
    if (!timeLeft || showResult) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  useEffect(() => {
    if (timeLeft === 0) {
      setShowResult(true);
    }
  }, [timeLeft]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
    const isCorrect = index === currentQuestion.correctOption;
    if (isCorrect) setScore((prev) => prev + 1);
    setFeedback(isCorrect ? "✅ Correct!" : "❌ Wrong!");

    setTimeout(() => {
      setFeedback("");
      setSelectedOption(null);
      if (currentQuestionIndex + 1 < quizData?.questions?.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const sanitizeOption = (opt) => {
    if (typeof opt !== "string") return "";
    return opt;
  };

  const handleQuizComplete = () => {
    onComplete(score); // Send the score back to the parent
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
        <button
          className="absolute top-2 right-4 text-xl text-gray-700 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>

        {showResult ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Quiz Completed 🎉</h2>
            <p>Your Score: {score} / {quizData?.questions?.length}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleQuizComplete}
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {quizData?.questions?.length}</span>
              <span>⏳ {formatTime(timeLeft)}</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{currentQuestion?.questionText}</h3>
              <div className="space-y-3">
                {currentQuestion?.options?.map((option, index) => (
                  <button
                    key={index}
                    disabled={selectedOption !== null}
                    onClick={() => handleOptionSelect(index)}
                    className={`w-full text-left px-4 py-2 rounded border transition
                      ${selectedOption === index
                        ? index === currentQuestion.correctOption
                          ? "bg-green-200 border-green-600"
                          : "bg-red-200 border-red-600"
                        : "hover:bg-gray-100 border-gray-300"}`}
                  >
                    {sanitizeOption(option)}
                  </button>
                ))}
              </div>
            </div>

            {feedback && (
              <div className="text-center text-lg font-semibold mt-4">
                {feedback}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
