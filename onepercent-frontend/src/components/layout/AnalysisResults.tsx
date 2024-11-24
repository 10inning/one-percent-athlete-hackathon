const AnalysisResults = ({ results, badFormImages }) => {
    if (!results) return null;
  
    return (
      <div className="mt-4 p-4 border rounded-lg shadow-lg bg-white">
        <h2 className="text-lg font-bold mb-4">Push-up Analysis Report</h2>
        <pre className="text-sm bg-gray-100 p-2 rounded-lg">{results.summary}</pre>
  
        {badFormImages.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Bad Form Frames:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {badFormImages.map((frame, index) => (
                <div key={index} className="p-2 border rounded-lg shadow-sm">
                  <img
                    src={`data:image/jpeg;base64,${frame.image}`}
                    alt={`Bad Form Frame ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-700 mt-2">{frame.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  