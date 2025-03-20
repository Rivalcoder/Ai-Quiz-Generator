import "../../app/globals.css";

export default function ProgressBar({ current, total, score }) {
  const progress = (current / total) * 100;
  
  return (
    <div className="mb-8 px-2">
      <div className="flex justify-between items-center mb-3">
        <span className="text-base font-medium text-gray-700">
          Question {current} of {total}
        </span>
        <span className="text-base font-medium text-indigo-600">
          Score: {score}/{current - 1}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}