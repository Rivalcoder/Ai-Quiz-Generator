// pages/index.js
import { useState, useEffect } from "react";
import QuizCard from "./components/QuizCard";
import ProgressBar from "./components/ProgressBar";
import confetti from "canvas-confetti";
import "../app/globals.css";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("/api/generateQuiz");
        if (!response.ok) throw new Error("Failed to load questions");
        
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchQuestions();
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
      triggerConfetti();
    }
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setQuizCompleted(true);
        if (score / questions.length > 0.7) {
          triggerConfetti();
        }
      }
    }, 1500);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-indigo-600 p-8 text-white">
              <h1 className="text-4xl font-bold text-center">JavaScript Quiz</h1>
              <p className="text-center text-indigo-200 mt-3 text-lg">Test your JavaScript knowledge</p>
            </div>

            <div className="p-8">
              {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-6 text-gray-600 text-lg">Loading your quiz...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded">
                  <p className="text-red-700 text-lg">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && questions.length > 0 && !quizCompleted && (
                <>
                  <div className="mb-8">
                    <ProgressBar 
                      current={currentIndex + 1} 
                      total={questions.length} 
                      score={score}
                    />
                  </div>
                  <QuizCard 
                    question={questions[currentIndex]} 
                    onAnswer={handleAnswer}
                  />
                </>
              )}

              {quizCompleted && (
                <div className="text-center py-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
                  <div className="mt-6 text-7xl font-bold text-indigo-600">
                    {score}/{questions.length}
                  </div>
                  <p className="mt-6 text-xl text-gray-600">
                    {score / questions.length >= 0.8 
                      ? "Excellent work! You're a JavaScript expert!" 
                      : score / questions.length >= 0.6 
                      ? "Good job! You know your JavaScript well." 
                      : "Keep practicing your JavaScript skills!"}
                  </p>
                  <button 
                    onClick={restartQuiz}
                    className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-lg"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && questions.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-600">No questions available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}