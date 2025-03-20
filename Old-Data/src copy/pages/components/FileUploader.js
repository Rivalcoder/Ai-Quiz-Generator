// components/FileUploader.jsx
import { useState } from 'react';
import { Upload, X } from 'lucide-react';

export default function FileUploader({ onFilesAnalyzed }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/generateQuiz', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze files');
      }

      const data = await response.json();
      onFilesAnalyzed(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Your Code Files</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center cursor-pointer hover:bg-indigo-50 transition-colors duration-300">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.html,.css"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-indigo-500 mb-4" />
              <p className="text-lg font-medium text-gray-800">
                Drop your code files here or click to browse
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports JavaScript, TypeScript, Python, Java, C++, HTML, CSS, and more
              </p>
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Selected Files:</h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                  <span className="text-gray-800 truncate">{file.name}</span>
                  <button 
                    type="button" 
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg font-medium transition-colors duration-300 ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Analyzing...' : 'Generate Quiz'}
        </button>
      </form>
    </div>
  );
}