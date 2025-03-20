import { useState, useRef, useEffect } from "react";
import { Upload, X, Folder, FileText, AlertCircle, Loader } from "lucide-react";

export default function FileUploader({ onFilesAnalyzed }) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const allowedExtensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".c", ".cpp", ".html", ".css"];

  const isValidFile = (file) => {
    const extension = "." + file.name.split(".").pop().toLowerCase();
    
    // Skip node_modules, package files, and other library files
    if (file.path?.includes("node_modules") || 
        file.webkitRelativePath?.includes("node_modules") ||
        file.name === "package-lock.json" || 
        file.name === "package.json") {
      return false;
    }
    
    return allowedExtensions.includes(extension);
  };

  const handleFileChange = (e) => {
    setError("");
    const selectedFiles = Array.from(e.target.files).filter(isValidFile);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    } else {
      setError("No valid code files found. Please upload .js, .jsx, .ts, .tsx, .py, .java, .c, .cpp, .html, or .css files.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    setError("");
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(isValidFile);
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
    } else {
      setError("No valid code files found. Please upload .js, .jsx, .ts, .tsx, .py, .java, .c, .cpp, .html, or .css files.");
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please upload at least one code file to generate a quiz.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Create a FormData object to send files to the API
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Send files to the API for analysis
      const response = await fetch('/api/generateQuiz', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze files');
      }
      
      const quizData = await response.json();
      onFilesAnalyzed(quizData);
    } catch (err) {
      setError(`Error generating quiz: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2">Code Quiz Generator</h2>
        <p className="text-gray-600 mb-6">Upload your code files and our AI will create a personalized quiz to test your knowledge.</p>

        <div 
          className={`border-2 ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-dashed bg-gray-50'} rounded-lg p-8 text-center cursor-pointer hover:bg-gray-100 transition relative`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium text-lg mb-2">Drag and Drop Files Here</p>
          <p className="text-gray-500">or</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Select Files
            </button>
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                folderInputRef.current.click();
              }}
            >
              <Folder className="h-4 w-4 mr-2" />
              Select Folder
            </button>
          </div>
        </div>

        <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        <input type="file" webkitdirectory="true" directory="true" multiple className="hidden" ref={folderInputRef} onChange={handleFileChange} />

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-700">Selected Files ({files.length})</h3>
              <button 
                className="text-red-500 text-sm hover:text-red-700"
                onClick={() => setFiles([])}
              >
                Clear All
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
              {files.map((file, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-gray-700 truncate max-w-xs">{file.name}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFiles(files.filter((_, i) => i !== index));
                    }} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          className={`w-full mt-6 px-6 py-4 ${isLoading || files.length === 0 ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg transition text-lg font-medium flex justify-center items-center`}
          onClick={handleSubmit}
          disabled={isLoading || files.length === 0}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-3" />
              Generating Quiz...
            </>
          ) : (
            "Generate Quiz"
          )}
        </button>
      </div>
    </div>
  );
}