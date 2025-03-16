import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, ArrowRight, HelpCircle } from "lucide-react";

export default function QuizCard({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showHint, setShowHint] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // Reset state and shuffle options when question changes
    setSelected(null);
    setShowAnswer(false);
    setTimeRemaining(30);
    setShowHint(false);
    setShuffledOptions(shuffleArray(question.options));
  }, [question]);

  useEffect(() => {
    if (timeRemaining > 0 && !showAnswer) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showAnswer) {
      setShowAnswer(true);
    }
  }, [timeRemaining, showAnswer]);

  // Calculate time indicator color based on remaining time
  const getTimeColor = () => {
    if (timeRemaining > 20) return "bg-green-100 text-green-800";
    if (timeRemaining > 10) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handleOptionClick = (option) => {
    if (!showAnswer) {
      setSelected(option);
      setShowAnswer(true);
    }
  };

  const handleNextQuestion = () => {
    // Only now submit the answer and move to next question
    onAnswer(selected === question.answer);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mx-auto w-full max-h-full border border-gray-200 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold text-gray-800 flex-grow">{question.question}</div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${getTimeColor()}`}>
          <Clock size={16} className="inline-block mr-2" /> {timeRemaining}s
        </div>
      </div>

      <div className="mt-4 space-y-3 flex-grow overflow-y-auto max-h-96">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            className={`w-full text-black p-4 rounded-lg text-left transition-all duration-200 flex justify-between items-center ${
              !showAnswer 
                ? "hover:bg-indigo-50 border border-gray-200" 
                : selected === option
                  ? option === question.answer
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-red-100 border-2 border-red-500"
                  : option === question.answer
                    ? "bg-green-50 border border-green-300"
                    : "bg-gray-50 border border-gray-200 opacity-70"
            }`}
            onClick={() => handleOptionClick(option)}
            disabled={showAnswer}
          >
            <span className="flex-grow">{option}</span>
            {showAnswer && (
              option === question.answer ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : selected === option ? (
                <XCircle className="h-5 w-5 text-red-600" />
              ) : null
            )}
          </button>
        ))}
      </div>

      {!showAnswer && (
        <div className="mt-4 flex justify-center">
          <button
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium flex items-center hover:bg-indigo-200 transition"
            onClick={() => setShowHint(!showHint)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        </div>
      )}

      {showHint && !showAnswer && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <p>Think about the code structure and what this component does in the application.</p>
        </div>
      )}

      {showAnswer && (
        <div className={`mt-4 p-4 rounded-lg ${selected === question.answer ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <p className={`font-medium ${selected === question.answer ? "text-green-700" : "text-red-700"}`}>
            {selected === question.answer ? (
              <span className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Correct! Well done!
              </span>
            ) : (
              <span className="flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                Wrong! The correct answer is: {question.answer}
              </span>
            )}
          </p>
          <p className="mt-2 text-gray-700">
            {question.explanation || "Understanding this concept is important for writing effective code."}
          </p>
        </div>
      )}

      {showAnswer && (
        <div className="mt-4 flex justify-end">
          <button
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium flex items-center hover:bg-indigo-700 transition"
            onClick={handleNextQuestion}
          >
            Next Question
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}