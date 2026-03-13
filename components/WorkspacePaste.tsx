"use client";
import { TypeAnimation } from "react-type-animation";

import { useState } from "react";
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";
import { json } from "stream/consumers";
import { ScoreBar } from "./dashboard/ScoreBars";
import { error } from "console";
import Navbar from "@/components/Navbar";

export default function WorkspacePaste() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  
  const [loading, setloading] = useState(false);
  const [done, setdone] = useState(false)

  const [code, setCode] = useState("");
  const [Score, setscore] = useState(["Maintainability: ", "Readability: ","Performance: ", "Security: "]); 
  const [result, setResult] = useState({ response: { code_explaination: "", time_complexity: "", space_complexity: "", "Bug&Error": ["nothing found"], optimization: ["no improvements found"], scores: { maintainability: 0, readability: 0, performance: 0, security: 0 } },done: false,error: false });

  const handleAnalyze = async () => {
    if(code.trim()===""){
      alert("Please enter some code to analyze.");
      return;
    }
    setloading(true);
    setResult({  done: false,error: false, response: { code_explaination: "", time_complexity: "", space_complexity: "", "Bug&Error": ["nothing found"], optimization: ["no improvements found"], scores: { maintainability: 0, readability: 0, performance: 0, security: 0 } } });

try {

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
    // if(cleaned.done===false){
    //   setResult({ response: { code_explaination: "Error analyzing code! Try Again", time_complexity: "", space_complexity: "", "Bug&Error": ["nothing found"], optimization: ["no improvements found"], scores: { maintainability: 0, readability: 0, performance: 0, security: 0 } }, done: true, error: true });
    //   setloading(false);
    //   return;
    // }
    
    const objResponse = JSON.parse(cleaned.replace(/\/\/.*$/gm, ""));
    console.log("Parsed object response type:", typeof objResponse);
    console.log("Parsed object response:", objResponse);
    setResult({ response: objResponse, done: true, error: false });
    setloading(false);
    return;
  }catch(err){
    console.error("Error in handleAnalyze:", err);
    setResult({ response: { code_explaination: "Error analyzing code! Try Again", time_complexity: "", space_complexity: "", "Bug&Error": ["nothing found"], optimization: ["no improvements found"], scores: { maintainability: 0, readability: 0, performance: 0, security: 0 } }, done: true, error: true });
    setloading(false);
    return;
  };

}




  return (
    <div  className=" ">
      <Navbar />
      <textarea
        className={`w-full h-60 p-4 border mt-2 ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} transition-all ease-in-out duration-1000 rounded`}
        placeholder="Paste your code..."
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        className={`  mt-4 px-4 py-2 rounded ${mode === "dark" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"} transition-all ease-in-out duration-1000 rounded ${loading ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {`${loading ? "Analyzing..." : "Analyze Code"}`}
      </button>

      {/* <ReactMarkdown>{result}</ReactMarkdown> */}
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
        !result.error && result.done &&<div className=" w-full border mt-4 p-4 rounded">
          <h2 className="font-bold">Code Explanation:</h2>
        <TypeAnimation
          sequence={[
            result.response.code_explaination,
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        />

      <h2 className="font-bold">Time Complexity:</h2>
      <TypeAnimation
          sequence={[
            result.response.time_complexity,
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        />

      <h2 className="font-bold">Space Complexity:</h2>
      <TypeAnimation
          sequence={[
            result.response.space_complexity, 
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        />
      
      

      <h2 className="font-bold">Issues:</h2>
      <p>{result.response["Bug&Error"]?.length===0 ? <TypeAnimation
          sequence={[
            "No issues found",
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        /> : <TypeAnimation
          sequence={[
            result.response["Bug&Error"]?.map((issue: string, index: number) => `${index + 1}. ${issue}`).join("\n") || "No issues found",
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        />}</p>
      <h2 className="font-bold">Improvements:</h2>
      <p>{result.response.optimization?.length===0 ? <TypeAnimation
          sequence={[
            "No improvements suggested",
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        /> : <TypeAnimation
          sequence={[
            result.response["optimization"]?.map((opt: string, index: number) => `${index + 1}. ${opt}`).join("\n") || "No improvements suggested",
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        />}</p>
      <h2 className="font-bold">Scores:</h2>
      <TypeAnimation
          sequence={[
            `Maintainability: ${result.response?.scores?.maintainability?.toFixed(0)}/10`,
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        />
        <br />
      <TypeAnimation
          sequence={[
            `Performance: ${result.response?.scores?.performance?.toFixed(0)}/10`,
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        />
        <br />
      <TypeAnimation
          sequence={[
            `Security: ${result.response?.scores?.security?.toFixed(0)}/10`,
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        /> 
        <br />
        <TypeAnimation
          sequence={[
            result.response.scores?.readability ? `Readability: ${result.response.scores.readability.toFixed(0)}/10` : "Readability score not available", 
            1000,
          ]}
          wrapper="span"
      speed={50}
      cursor={false}
      repeat={1}
        />

      

        </div>
      }

      {
        result.done && result.error && <div className="w-full border mt-4 p-4 rounded bg-red-100 text-red-700">
          <h2 className="font-bold">Error</h2>
          <p>There was an error analyzing the code. Please try again.</p>
          <button className="border bg-red-500 text-white py-2 px-4 rounded" onClick={handleAnalyze}>Try Again</button>
        </div>
      }
      
        
      
    </div>
  );
}
