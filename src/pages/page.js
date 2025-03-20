import { useState } from "react";
import QuizCard from "./components/QuizCard";
import ProgressBar from "./components/ProgressBar";
import FileUploader from "./components/FileUploader";
import confetti from "canvas-confetti";
import { Award, BarChart, TrendingUp } from "lucide-react";
import "../app/globals.css";

export default function Welcome() {
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
          <div className={`${quizCompleted ? "hidden" : "block"} p-4 md:p-6`}>
            <h1 className="text-2xl md:text-4xl font-extrabold text-center text-indigo-700">{quizTitle}</h1>
            <p className="text-center text-gray-600 mt-1 md:mt-2">Challenge yourself with this code quiz!</p>
          </div>

          <div className="flex-grow overflow-auto p-4 md:p-6">
            {!quizCompleted ? (
              <div className="flex flex-col h-full gap-4">
                {/* Progress bar in compact format at the top with icons */}
                <div className="w-full bg-white shadow-md rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart className="text-indigo-500 h-5 w-5 mr-2" />
                      <span className="text-sm font-medium text-gray-700 mr-1">Progress:</span>
                      <span className="text-sm font-bold text-indigo-700">{currentIndex + 1}/{questions.length}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className="text-green-500 h-5 w-5 mr-2" />
                      <span className="text-sm font-medium text-gray-700 mr-1">Score:</span>
                      <span className="text-sm font-bold text-green-600">{score}/{currentIndex > 0 ? currentIndex : 0}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <TrendingUp className="text-purple-500 h-5 w-5 mr-2" />
                      <span className="text-sm font-medium text-gray-700 mr-1">Remaining:</span>
                      <span className="text-sm font-bold text-purple-600">{questions.length - currentIndex}</span>
                    </div>
                    
                    <div className="w-1/4 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-700 ease-out" 
                        style={{ width: `${(currentIndex / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Main content with question and options in a single row */}
                <div className="flex flex-col md:flex-row gap-4 flex-grow">
                  {/* Left side - Question with code */}
                  <div className="flex-1">
                    <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 h-full">
                      <div className="text-xl font-semibold text-gray-800 mb-4">{questions[currentIndex]?.question}</div>
                      
                      {/* Code snippet - ensure it's visible */}
                      <div className="mt-2 bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm whitespace-pre-wrap">
                          <code className="text-wrap">{questions[currentIndex]?.codeSnippet || questions[currentIndex]?.questionCode}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Options */}
                  <div className="flex-1">
                    <QuizCard 
                      question={{
                        ...questions[currentIndex],
                        // Remove duplicate code in QuizCard component
                        questionCode: "" 
                      }} 
                      onAnswer={(correct) => {
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
                      }} 
                    />
                  </div>
                </div>
              </div>
            ) : (
            <div className="flex h-[100dvh] w-full bg-gradient-to-b from-teal-50 to-cyan-100">
            <div className="m-auto w-full max-w-3xl p-6">
              <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-6 text-white">
                  <h2 className="text-3xl font-bold text-center mb-2">Quiz Results</h2>
                  <p className="text-center text-teal-100">
                    {score === questions.length 
                      ? "Perfect score! Exceptional work!" 
                      : score / questions.length >= 0.8 
                        ? "Outstanding performance!" 
                        : score / questions.length >= 0.6 
                          ? "Good effort! Keep it up!" 
                          : "A great learning opportunity!"}
                  </p>
                </div>
                
                {/* Results Section */}
                <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                  {/* Score Display */}
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-5xl font-bold text-teal-600">
                        {Math.round((score / questions.length) * 100)}
                      </span>
                      <span className="text-xl text-teal-500">points</span>
                    </div>
                    {/* Circular Progress */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="40" 
                        fill="none" 
                        stroke="#e6f7f5" 
                        strokeWidth="10"
                      />
                      <circle 
                        cx="50" cy="50" r="40" 
                        fill="none" 
                        stroke={
                          score / questions.length >= 0.8 ? "#0d9488" :
                          score / questions.length >= 0.6 ? "#14b8a6" : "#2dd4bf"
                        }
                        strokeWidth="10"
                        strokeDasharray="251.3"
                        strokeDashoffset={251.3 - (251.3 * (score / questions.length))}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  
                  {/* Details */}
                  <div className="flex-grow">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-3xl">
                          {score / questions.length >= 0.8 ? "🏅" : 
                          score / questions.length >= 0.6 ? "✨" : "🔍"}
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800">Your Score</h3>
                      </div>
                      <p className="text-xl text-gray-600 mb-2">
                        You answered <span className="font-bold text-teal-600">{score}</span> out of <span className="font-bold">{questions.length}</span> questions correctly
                      </p>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${(score / questions.length) * 100}%`,
                            backgroundColor: 
                              score / questions.length >= 0.8 ? "#0d9488" :
                              score / questions.length >= 0.6 ? "#14b8a6" : "#2dd4bf"
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 mb-6">
                      <p className="text-gray-700">
                        {score === questions.length 
                          ? "Incredible! You've mastered this material completely. Ready for the next challenge?" 
                          : score / questions.length >= 0.8 
                            ? "Excellent work! Your understanding of the code concepts is very strong." 
                            : score / questions.length >= 0.6 
                              ? "Good job! You have a solid foundation. A bit more practice will make you an expert." 
                              : "This is a great opportunity to revisit the material. Keep practicing and you'll improve quickly!"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="bg-gray-50 px-8 py-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg border border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition flex items-center justify-center gap-2 flex-1"
                    onClick={() => setIsQuizGenerated(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    New Quiz
                  </button>
                  
                  <button
                    className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2 flex-1"
                    onClick={() => {
                      setCurrentIndex(0);
                      setScore(0);
                      setQuizCompleted(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Retry Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}