"use client";
import { TypeAnimation } from "react-type-animation";
import Editor from "@monaco-editor/react";
import Image from "next/image";
import { useSession } from "next-auth/react"

import { useEffect, useState,ChangeEvent } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import { get } from "http";
import { json } from "stream/consumers";
// type SavedItem = {
//   id: string
//  response: any
//   createdAt: string
//   category: string
//   saved: boolean
// }

export default function WorkspaceFile({ file_id }: { file_id: string }) {
    // const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const session = useSession();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [saved, setsaved] = useState(false);
  const [loading, setloading] = useState(false);
  const [done, setdone] = useState(false);
  const [email, setemail] = useState('')
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [sourceCode, setSourceCode] = useState<string>("");

  const extensionMap: Record<string, string> = {
  javascript: ".js,.jsx",
  typescript: ".ts,.tsx",
  python: ".py",
  java: ".java",
  cpp: ".cpp,.h",
  c: ".c,.h",
  go: ".go",
  rust: ".rs",
  php: ".php",
  json: ".json",
  html: ".html",
  css: ".css",
  sql: ".sql",
        
        
        
};
  
  const [result, setResult] = useState({
    response: {
      title: "",
      code_explaination: "",
      time_complexity: "",
      space_complexity: "",
      "Bug&Error": ["nothing found"],
      optimization: ["no improvements found"],
      scores: {
        maintainability: 0,
        readability: 0,
        performance: 0,
        security: 0,
      },
    },
    done: false,
    error: false,
    category: "cp",
  });

  useEffect(() => {
    if(session.status === "authenticated"){
      setemail(session.data.user?.email || "")
      setName(session.data.user?.name || "")
    }
  }, [session])

  function handleChange(value: string | undefined) {
    setCode(value as string);
    console.log("language:", language);
  }

  const handleAnalyze = async () => {
    if (code.trim() === "") {
      alert("Please enter some code to analyze.");
      return;
    }
    setloading(true);
    setResult({
      done: false,
      error: false,
      category: "cp",
      response: {
        title: "",
        code_explaination: "",
        time_complexity: "",
        space_complexity: "",
        "Bug&Error": ["nothing found"],
        optimization: ["no improvements found"],
        scores: {
          maintainability: 0,
          readability: 0,
          performance: 0,
          security: 0,
        },
      },
    });

    try {
      const res = await fetch("/api/analyze/paste", {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      console.log("Response:", res);

      const data = await res.json();

      console.log("Data received type:", typeof data);
      console.log("Data received:", data);
      

      const cleaned = data.result;
      console.log("Cleaned response type:", typeof cleaned);
      console.log("Cleaned response:", cleaned);
      if(cleaned.done && cleaned.error){
        setloading(false);
        setResult({
          response: {
            title: "",
            code_explaination: "Error analyzing code! Try Again",
            time_complexity: "",
            space_complexity: "",
            "Bug&Error": ["nothing found"],
            optimization: ["no improvements found"],
            scores: {
              maintainability: 0,
              readability: 0,
              performance: 0,
              security: 0,
            },
          },
          done: true,
          error: true,
          category: "cp",
        });
        
      }else{

        const objResponse = JSON.parse(cleaned.replace(/\/\/.*$/gm, ""));
        console.log("Parsed object response type:", typeof objResponse);
        console.log("Parsed object response:", objResponse);
        const newResult = { response: objResponse, done: true, error: false, category: "cp" };
        
        setResult(newResult);
        
        if (session.status === "authenticated") {
          if (file_id === "temp") {
            return;
          } else {
            handleSave(newResult);
          }
        }
        setloading(false);
      }
      return;
    } catch (err) {
      console.error("Error in handleAnalyze:", err);
      
      setloading(false);
      
      return;
    }
  };


  const handleSave = async (reportData:any) => {
    // Implement save functionality here, e.g., send result to backend to save in database
    try {  
      console.log("language",language)
      const res = await fetch("/api/history/save", {
        method: "POST",
        body: JSON.stringify({email: email,
    username: name,
    code,
    id:file_id, ...reportData ,date: new Date().toLocaleString(),saved, category: "doc",language}),
      });
      const data = await res.json();
      console.log("Save response:", data);
      // alert("Report saved successfully!");
    }
    catch (err) {
      console.error("Error saving report:", err);
    }
  };

  const toggleSave = async (id: string, currentState: boolean) => {
    const res = await fetch("/api/togglesave", {
      method: "POST",
      body: JSON.stringify({
        id,
        email: email,
        saved: !currentState, // toggle
      }),
    });
  
    const data = await res.json();
  
    // update UI instantly
    setsaved(!currentState);
    // setSavedItems(prev =>
    //   prev.map(item =>
    //     item.id === id ? { ...item, saved: !currentState } : item
    //   )
    // );
  };

  const getreport = async (id: string) => {
    try {
      console.log("Fetching report for paste ID:", id, "and email:", email);
      const res = await fetch("/api/getreport", {
        method: "POST",
        body: JSON.stringify({ id }), // ✅ FIXED
      })
      const data = await res.json()
      if(data.error){
        console.log("New Analysis:", data.error);
        return;
      }
      console.log("Report data:", data)
      setResult({
        response: data.response,
        done: data.done,
        error: data.error,
        category: data.category,
      })
      setCode(data.code)
      setLanguage(data.language)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getreport(file_id)
  
    
  }, [])

  //  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // Access files from e.target.files or e.currentTarget.files
  //   const files = e.target.files;
    
  //   if (files && files.length > 0) {
  //     setFile(files[0]); // Get the first file
  //     console.log("Selected file:", files[0]);
  //   }
  // };

  

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed:", e.target.files);
    const file = e.target.files?.[0]; // Access the first file
    
    if (file) {
      const reader = new FileReader();

      // Triggered when file content is successfully read
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          setSourceCode(content);
          setCode(content); // Store the code in state
        }
      };

      // Read the raw file content as text
      reader.readAsText(file);
    }
  };
  



  return (
    <div className=" h-fit  overflow-auto no-scrollbar">
      <Navbar />
      <div className={`flex justify-between mt-4`}>
<select className={`${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"} transition-all ease-in-out duration-1000 mt-2 p-2 rounded`} value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option className="rounded" value="javascript">JavaScript</option>
        <option className="rounded" value="typescript">TypeScript</option>
        <option className="rounded" value="python">Python</option>
        <option className="rounded" value="java">Java</option>
        <option className="rounded" value="cpp">C++</option>
        <option className="rounded" value="c">C</option>
        <option className="rounded" value="go">Go</option>
        <option className="rounded" value="rust">Rust</option>
        <option className="rounded" value="php">PHP</option>
        <option className="rounded" value="json">json</option>
        <option className="rounded" value="html">HTML</option>
        <option className="rounded" value="css">CSS</option>
        <option className="rounded" value="sql">SQL</option>
      </select>
      <div className={`${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"} transition-all ease-in-out duration-1000 p-2 rounded`} >
<input 
      
        type="file" 
        accept={extensionMap[language]} 
        onChange={handleFileChange} 
      />
      </div>
      
      <button className={` cursor-pointer ${mode === "dark" ? "invert" : ""} transition-all ease-in-out duration-1000`} onClick={() => {toggleSave(file_id, saved)}}>
        
        
        <Image title={`${saved ? "UnSave" : "Save"}`} src={`${saved ? "/saved.svg" : "/saves.svg"}`} alt="Save" width={30} height={30} />
      </button>
      </div>
      
      <Editor
        className={`h-100  my-1 mt-2 border rounded ${mode === "dark" ? "border-white" : "border-gray-700"} transition-all ease-in-out duration-1000 `}
        height="100%"
        language={language}
        theme={`${mode === "dark" ? "vs-dark" : "vs-light"}`}
        value={code}
        onChange={handleChange}
        options={{
    fontSize: 14,
    fontFamily: "Fira Code",
    minimap: { enabled: false },
    lineNumbers: "on",
    smoothScrolling: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: "on",
    folding: true,
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    formatOnPaste: true,
  }}
      />

      <button
        onClick={handleAnalyze}
        className={`  mt-4 px-4 py-2 rounded resize ${mode === "dark" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"} transition-all ease-in-out duration-1000 rounded ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
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
      {!result.error && result.done && (
        <div className=" w-full border my-4 p-4 rounded">
          <h3 className="text-xl font-bold underline">{result.response.title}</h3>
          <h2 className="font-bold">Code Explanation:</h2>
          <TypeAnimation
            sequence={[result.response.code_explaination, 1000]}
            wrapper="span"
            speed={50}
            cursor={false}
            repeat={1}
          />

          <h2 className="font-bold">Time Complexity:</h2>
          <TypeAnimation
            sequence={[result.response.time_complexity, 1000]}
            wrapper="span"
            speed={50}
            cursor={false}
            repeat={1}
          />

          <h2 className="font-bold">Space Complexity:</h2>
          <TypeAnimation
            sequence={[result.response.space_complexity, 1000]}
            wrapper="span"
            speed={50}
            cursor={false}
            repeat={1}
          />

          <h2 className="font-bold">Issues:</h2>
          <div>
            {result.response["Bug&Error"]?.length === 0 ? (
              <TypeAnimation
                sequence={["No issues found", 1000]}
                wrapper="span"
                speed={50}
                cursor={false}
                repeat={1}
              />
            ) : (
              result.response["Bug&Error"]?.map((issue: string, index: number) => (
                <TypeAnimation
                  key={index}
                  sequence={[`${index + 1}. ${issue}`, 1000]}
                  wrapper="div"
                  speed={50}
                  cursor={false}  
                  repeat={1}
                />
              ))
            )}
          </div>
          <h2 className="font-bold">Improvements:</h2>
          <div>
            {result.response.optimization?.length === 0 ? (
              <TypeAnimation
                sequence={["No improvements suggested", 1000]}
                wrapper="span"
                speed={50}
                cursor={false}
                repeat={1}
              />
            ) : (
              result.response.optimization.map((opt: string, index: number) => (
               <TypeAnimation
                key={index}
                sequence={[`${index + 1}. ${opt}`, 1000]}
                wrapper="div"
                speed={50}
                cursor={false}
                repeat={1}
              />
              ))
            )}
          </div>
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
              result.response.scores?.readability
                ? `Readability: ${result.response.scores.readability.toFixed(0)}/10`
                : "Readability score not available",
              1000,
            ]}
            wrapper="span"
            speed={50}
            cursor={false}
            repeat={1}
          />
        </div>
      )}
{/* traffic alert */}
      {result.done && result.error && (
        <div className="w-full border mt-4 p-4 rounded bg-red-100 text-red-700">
          <h2 className="font-bold">Sorry for the inconvenience</h2>
          <p>Due to users traffic, the analysis model is currently busy. Please try again.</p>
          <button
            className="border bg-red-500 text-white py-2 px-4 rounded mt-1"
            onClick={handleAnalyze}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
