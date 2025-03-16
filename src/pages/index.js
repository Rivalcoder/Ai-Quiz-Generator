import { useState } from "react";
import QuizCard from "./components/QuizCard";
import ProgressBar from "./components/ProgressBar";
import FileUploader from "./components/FileUploader";
import confetti from "canvas-confetti";
import "../app/globals.css";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isQuizGenerated, setIsQuizGenerated] = useState(false);

  const handleFilesAnalyzed = (data) => {
    setQuizTitle(data.quizTitle);
    setQuestions(data.questions);
    setIsQuizGenerated(true);
    setCurrentIndex(0);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
      {!isQuizGenerated ? (
        <FileUploader onFilesAnalyzed={handleFilesAnalyzed} />
      ) : (
        <div className="flex flex-col w-full h-full max-h-screen bg-white shadow-2xl overflow-hidden">
          <div className={`${quizCompleted?"hidden":"p-2"} p-4 md:p-6 `}>
            <h1 className= "text-2xl md:text-4xl font-extrabold text-center text-indigo-700">{quizTitle}</h1>
            <p className="text-center text-gray-600 mt-1 md:mt-2">Challenge yourself with this quiz!</p>
          </div>

          <div className="flex-grow overflow-auto p-4 md:p-6">
            {!quizCompleted ? (
              <div className="flex flex-col md:flex-row h-full gap-4">
                
                {/* Progress section (left side on desktop) */}
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <ProgressBar current={currentIndex + 1} total={questions.length} score={score} />
                </div>
                
                {/* Question section (right side on desktop) */}
                <div className="w-full md:w-2/3">
                  <QuizCard question={questions[currentIndex]} onAnswer={(correct) => {
                    if (correct) {
                      setScore(score + 1);
                      confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                      });
                    }
                    if (currentIndex < questions.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                    } else {
                      setQuizCompleted(true);
                      if (score / questions.length >= 0.7) {
                        confetti({
                          particleCount: 200,
                          spread: 180,
                          origin: { y: 0.6 }
                        });
                      }
                    }
                  }} />
                </div>
              </div>
            ) : (
              <div className="flex max-h-screen min-w-screen flex-col items-center justify-center  bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 md:p-8 shadow-inner overflow-auto">
                <div className="mb-4 md:mb-6">
                  {score / questions.length >= 0.8 ? (
                    <div className="text-4xl md:text-6xl mb-2 md:mb-4">🏆</div>
                  ) : score / questions.length >= 0.6 ? (
                    <div className="text-4xl md:text-6xl mb-2 md:mb-4">🌟</div>
                  ) : (
                    <div className="text-4xl md:text-6xl mb-2 md:mb-4">📚</div>
                  )}
                </div>
                
                <h2 className="text-2xl md:text-4xl font-bold text-indigo-800 mb-2">Quiz Complete!</h2>
                
                <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4 md:mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl md:text-5xl font-bold text-indigo-700">
                      {Math.round((score / questions.length) * 100)}%
                    </div>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e0e0e0" 
                      strokeWidth="8"
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke={
                        score / questions.length >= 0.8 ? "#4c1d95" :
                        score / questions.length >= 0.6 ? "#6d28d9" : "#8b5cf6"
                      }
                      strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * (score / questions.length))}
                      transform="rotate(-90 50 50)"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                
                <p className="text-lg md:text-xl font-medium mb-2 md:mb-3">You scored {score} out of {questions.length} questions</p>
                
                <div className="bg-white p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-8 max-w-md">
                  <p className="text-base md:text-lg text-gray-700">
                    {score === questions.length 
                      ? "Perfect score! You're a true master of this subject!" 
                      : score / questions.length >= 0.8 
                        ? "Excellent work! Your knowledge is impressive!" 
                        : score / questions.length >= 0.6 
                          ? "Good job! You've got a solid understanding!" 
                          : "Keep learning! Every attempt brings new knowledge."}
                  </p>
                </div>
                
                <div className="mt-4 h-screen md:mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105"
                    onClick={() => setIsQuizGenerated(false)}
                  >
                    <div className="flex items-center justify-center">
                      <span className="mr-2">📚</span>
                      <span>Take Another Quiz</span>
                    </div>
                  </button>
                  
                  <button
                    className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105"
                    onClick={() => {
                      setCurrentIndex(0);
                      setScore(0);
                      setQuizCompleted(false);
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🔄</span>
                      <span>Retry This Quiz</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}