import { Award, TrendingUp, BarChart } from "lucide-react";

export default function ProgressBar({ current, total, score }) {
  const progress = (current / total) * 100;
  const scorePercentage = current > 1 ? Math.round((score / (current - 1)) * 100) : 0;
  
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
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <BarChart className="text-indigo-500 h-6 w-6 mr-3" />
          <div>
            <h3 className="text-sm text-gray-500 font-medium">Progress</h3>
            <p className="text-lg font-bold text-gray-800">
              {current}/{total} <span className="text-sm font-normal">Questions</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <Award className="text-indigo-500 h-6 w-6 mr-3" />
          <div>
            <h3 className="text-sm text-gray-500 font-medium">Current Score</h3>
            <p className="text-lg font-bold text-gray-800">
              {score}/{current > 1 ? current - 1 : 0}
              <span className={`ml-2 text-sm font-normal ${getScoreColor()}`}>
                {current > 1 ? `(${scorePercentage}%)` : "(0%)"}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <TrendingUp className="text-indigo-500 h-6 w-6 mr-3" />
          <div>
            <h3 className="text-sm text-gray-500 font-medium">To Complete</h3>
            <p className="text-lg font-bold text-gray-800">
              {total - current + 1} <span className="text-sm font-normal">Remaining</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Quiz Progress</span>
          <span className="text-sm font-semibold text-indigo-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}