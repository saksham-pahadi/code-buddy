"use client";

import { useState } from "react";
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";
import { json } from "stream/consumers";

export default function Workspace() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [loading, setloading] = useState(false);

  const [code, setCode] = useState("");
  const [result, setResult] = useState({ response: { summary: "", time_complexity: "", space_complexity: "", issues: [], improvements: [] },done: false });

  const handleAnalyze = async () => {
    setloading(true);
    const res = await fetch("/api/analyze/paste", {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    console.log("Response:", res);

    const data = await res.json();
    
    console.log("Data received type:",typeof data);
    console.log("Data received:",data);
    const cleaned = data.result;
    console.log("Cleaned response type:", typeof cleaned);
    console.log("Cleaned response:", cleaned);
    
    const objResponse = JSON.parse(cleaned.response.replace(/\/\/.*$/gm, ""));
    console.log("Parsed object response type:", typeof objResponse);
    console.log("Parsed object response:", objResponse);
    setResult({ response: objResponse, done: true });
    setloading(false);
  };

  return (
    <div className="p-8">
      <textarea
        className={`w-full h-60 p-4 border ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} transition-all ease-in-out duration-1000 rounded`}
        placeholder="Paste your code..."
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        className={`  mt-4 px-4 py-2 rounded ${mode === "dark" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"} transition-all ease-in-out duration-1000 rounded`}
      >
        Analyze
      </button>

      {/* <ReactMarkdown>{result}</ReactMarkdown> */}
      {loading && <p className="mt-4">Analyzing...</p>}
      {
//         {
//   "summary": "Short 2-3 line explanation of what code does",
//   "time_complexity": "Big-O notation with short reason",
//   "space_complexity": "Big-O notation with short reason",
//   "issues": ["Issue 1", "Issue 2"],
//   "improvements": ["Improvement 1", "Improvement 2"]
// }
      }
      {
        result.done && <div>
          <h2 className="font-bold">Summary</h2>
        <p>{result.response.summary}</p>

      <h2 className="font-bold">Time Complexity</h2>
      <p>{result.response.time_complexity}</p>

      <h2 className="font-bold">Space Complexity</h2>
      <p>{result.response.space_complexity}</p>

      <h2 className="font-bold">Issues</h2>
      <p>{result.response.issues}</p>
      <h2 className="font-bold">Improvements</h2>
      <p>{result.response.improvements}</p>
        </div>
        }
      
    </div>
  );
}
