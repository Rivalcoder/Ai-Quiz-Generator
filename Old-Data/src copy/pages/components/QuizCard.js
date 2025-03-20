import "../../app/globals.css";


import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function QuizCard({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timeIsRunning, setTimeIsRunning] = useState(true);
  const [randomizedOptions, setRandomizedOptions] = useState([]);

  // Randomize options when question changes
  useEffect(() => {
    if (question && question.options) {
      const shuffled = [...question.options].sort(() => Math.random() - 0.5);
      setRandomizedOptions(shuffled);
    }
    
    // Reset state when question changes
    setSelected(null);
    setShowAnswer(false);
    setTimeRemaining(30);
    setTimeIsRunning(true);
  }, [question]);

  useEffect(() => {
    let timer;
    if (timeIsRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timeIsRunning) {
      setTimeIsRunning(false);
      handleSelect(null); // Time's up, count as wrong
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, timeIsRunning]);

  const handleSelect = (option) => {
    if (selected !== null || !timeIsRunning) return; // Prevent multiple selections
    
    setTimeIsRunning(false);
    setSelected(option);
    setShowAnswer(true);
    
    const isCorrect = option === question.answer;
    onAnswer(isCorrect);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6 flex justify-between items-center">
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          timeRemaining > 10 ? "bg-green-100 text-green-800" : 
          timeRemaining > 5 ? "bg-yellow-100 text-yellow-800" : 
          "bg-red-100 text-red-800"
        }`}>
          {timeRemaining}s
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-8 px-2">{question.question}</h2>

      <div className="space-y-4">
        {randomizedOptions.map((option, index) => {
          const isCorrect = option === question.answer;
          const isSelected = selected === option;
          
          let buttonClasses = "relative text-black w-full text-left p-5 border-2 rounded-lg transition-all duration-300 ";
          
          if (!showAnswer) {
            buttonClasses += "hover:border-indigo-400 hover:bg-indigo-50 border-gray-200";
          } else if (isCorrect) {
            buttonClasses += "border-green-500 bg-green-50";
          } else if (isSelected) {
            buttonClasses += "border-red-500 bg-red-50";
          } else {
            buttonClasses += "border-gray-200 opacity-70";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={showAnswer}
              className={buttonClasses}
            >
              <div className="flex items-center">
                <div className="flex-grow text-lg">{option}</div>
                {showAnswer && isCorrect && (
                  <CheckCircle className="text-green-600 ml-3 h-6 w-6" />
                )}
                {showAnswer && isSelected && !isCorrect && (
                  <XCircle className="text-red-600 ml-3 h-6 w-6" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-lg">
          <p className="font-medium text-indigo-800 text-lg">
            {selected === question.answer ? 
              "Correct! Well done." : 
              `Incorrect. The correct answer is: ${question.answer}`
            }
          </p>
        </div>
      )}
    </div>
  );
}