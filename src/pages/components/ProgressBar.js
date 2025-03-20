import { Award, TrendingUp, BarChart } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProgressBar({ current, total, score }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const progress = (current / total) * 100;
  const scorePercentage = current > 1 ? Math.round((score / (current - 1)) * 100) : 0;
  
  // Animate progress bar when current changes
  useEffect(() => {
    setAnimatedProgress(progress);
  }, [progress]);
  
  // Animate score when score changes
  useEffect(() => {
    setAnimatedScore(scorePercentage);
  }, [scorePercentage]);
  
  // Function to determine score color based on percentage
  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-600";
    if (scorePercentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 h-full border border-gray-200">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Quiz Progress</h2>
      
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
          <BarChart className="text-indigo-500 h-6 w-6 mr-3" />
          <div>
            <h3 className="text-sm text-gray-500 font-medium">Progress</h3>
            <p className="text-lg font-bold text-gray-800">
              {current}/{total} <span className="text-sm font-normal">Questions</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
          <Award className="text-indigo-500 h-6 w-6 mr-3" />
          <div>
            <h3 className="text-sm text-gray-500 font-medium">Current Score</h3>
            <p className="text-lg font-bold text-gray-800">
              {score}/{current > 1 ? current - 1 : 0}
              <span className={`ml-2 text-sm font-normal ${getScoreColor()}`}>
                {current > 1 ? `(${animatedScore}%)` : "(0%)"}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-purple-500">
          <TrendingUp className="text-indigo-500 h-6 w-6 mr-3" />
          <div>
            <h3 className="text-sm text-gray-500 font-medium">To Complete</h3>
            <p className="text-lg font-bold text-gray-800">
              {total - current + 1} <span className="text-sm font-normal">Remaining</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Quiz Progress</span>
          <span className="text-sm font-semibold text-indigo-600">{Math.round(animatedProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-indigo-600 h-3 rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${animatedProgress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Visual indicators for recent score changes */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Performance Metrics</h3>
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const questionIndex = current - 6 + i;
            const isAnswered = questionIndex >= 0 && questionIndex < current - 1;
            const isCorrect = isAnswered && (questionIndex < score);
            
            return (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-4 h-4 rounded-full ${
                    !isAnswered ? "bg-gray-200" : isCorrect ? "bg-green-500" : "bg-red-500"
                  } ${questionIndex === current - 2 ? "animate-pulse" : ""}`}
                ></div>
                <div className="text-xs text-gray-500 mt-1">
                  {questionIndex + 1 > 0 ? questionIndex + 1 : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}