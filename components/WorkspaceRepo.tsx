"use client";
import { TypeAnimation } from "react-type-animation";
import Editor from "@monaco-editor/react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import GradientCircularProgress from "./GradientCircularProgress";

import { useEffect, useState, ChangeEvent } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { get } from "http";
import { set } from "mongoose";

export default function WorkspaceRepo({ repo_id }: { repo_id: string }) {
  // const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const session = useSession();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [saved, setsaved] = useState(false);
  const [loading, setloading] = useState(false);
  const [done, setdone] = useState(false);
  const [email, setemail] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [RepoLink, setRepoLink] = useState("");
  let [owner, repo] = ["", ""];
  const [Owner, setOwner] = useState("");
  const [Repo, setRepo] = useState("");
  const [Repositories, setRepositories] = useState<any[]>([]);
  const [RepositoryContent, setRepositoryContent] = useState<any>({success:false,
      totalFiles: Number,
       files: [] });
  const allowedExtensions = [".js", ".ts", ".tsx", ".jsx", ".py", ".java"];

  const ignoredFolders = ["node_modules", ".git", "dist", "build", ".next"];

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
    if (session.status === "authenticated") {
      setemail(session.data.user?.email || "");
      setName(session.data.user?.name || "");
    }
  }, [session]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    console.log("Input event:", e);
    try {
      if (
        !e.target.value.includes("github.com/") &&
        e.target.value.includes("https://")
      ) {
        toast.error(
          `This is not a valid GitHub repository link "${e.target.value}". Please enter a valid GitHub repository link.`,
        );
        return;
      } else if (
        e.target.value.includes("github.com/") &&
        !e.target.value.includes("https://")
      ) {
        setOwner(e.target.value.split("github.com/")[1].split("/")[0]);
        console.log(
          "Owner extracted:",
          e.target.value.split("github.com/")[1].split("/")[0],
        );
        return;
      } else if (!e.target.value.includes("https://github.com/")) {
        setOwner(e.target.value);
        return;
      } else if (
        e.target.value.split("github.com/")[1].split("/").length < 2 ||
        !e.target.value.split("github.com/")[1].split("/")[0] ||
        !e.target.value.split("github.com/")[1].split("/")[1]
      ) {
        toast.error(
          `This is not a valid GitHub repository link "${e.target.value}". Please enter a valid GitHub repository link.`,
        );
        return;
      }
      setRepoLink(e.target.value);

      [owner, repo] = e.target.value.split("github.com/")[1].split("/");
      setOwner(owner);
      setRepo(repo);
    } catch (err) {
      console.error("Error parsing repository link:", err);
      toast.error(
        `This is not a valid GitHub repository link "${e.target.value}". Please enter a valid GitHub repository link.`,
      );
    }
  }

  const fetchRepositories = async () => {
    try {
      if (!Owner) {
        toast.error("Please enter a GitHub repository link before fetching.");
        return;
      }

      const response = await fetch(
        `/api/fetch-repo`,
        {
          method: "POST",
          body: JSON.stringify({ Owner }),
        },
      );
      const data = await response.json();
      console.log("Fetched repositories:", data);
      if (data.message === "Not Found") {
        toast.error(
          `GitHub user "${Owner}" not found. Please check the username and try again.`,
        );
        return;
      } else if (data.length === 0) {
        toast.error(
          `GitHub user "${Owner}" has no public repositories. Please check the username and try again.`,
        );
        setRepositories([]);
        return;
      } else {
        setRepositories(data);
        toast.success(
          `Fetched ${data.length} repositories for user "${Owner}".`,
        );
      }
    } catch (error) {
      toast.error(
        `Failed to fetch repositories for user "${Owner}". Please check the GitHub username and try again.`,
      );
      console.error("Error fetching repository data:", error);
    }
  };

  async function getRepoContents(path: string, repoName: string, ownerName: string) {
    setloading(true);
    const repoUrl = `https://github.com/${ownerName}/${repoName}`;
    
     const res = await fetch("/api/fetch-repocontent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl,
        }),
      });

      const data = await res.json();
      console.log("Fetched repository content:", data);

      

    setRepositoryContent({...RepositoryContent, ...data});

    if (data.error) {
      toast.error(
        `Failed to fetch repository content for "${ownerName}/${repoName}". Please check the repository and try again.`,
      );
      console.log("Error fetching repository content:", data.error);
      return;
    }
    toast.success(
      `Fetched ${data.totalFiles} items for repository "${ownerName}/${repoName}".`,
    );
    setloading(false);
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
      if (cleaned.done && cleaned.error) {
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
      } else {
        const objResponse = JSON.parse(cleaned.replace(/\/\/.*$/gm, ""));
        console.log("Parsed object response type:", typeof objResponse);
        console.log("Parsed object response:", objResponse);
        const newResult = {
          response: objResponse,
          done: true,
          error: false,
          category: "cp",
        };

        setResult(newResult);

        if (session.status === "authenticated") {
          handleSave(newResult);
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

  const handleSave = async (reportData: any) => {
    // Implement save functionality here, e.g., send result to backend to save in database
    try {
      console.log("language", language);
      const res = await fetch("/api/history/save", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          username: name,
          code,
          id: repo_id,
          ...reportData,
          date: new Date().toLocaleString(),
          saved,
          category: "doc",
          language,
        }),
      });
      const data = await res.json();
      console.log("Save response:", data);
      // alert("Report saved successfully!");
    } catch (err) {
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
  };

  const getreport = async (id: string) => {
    try {
      console.log("Fetching report for Repo ID:", id, "and email:", email);
      const res = await fetch("/api/getreport", {
        method: "POST",
        body: JSON.stringify({ id }), // ✅ FIXED
      });
      const data = await res.json();
      if (data.error) {
        console.log("New Analysis:", data.error);
        return;
      }
      console.log("Report data:", data);
      setResult({
        response: data.response,
        done: data.done,
        error: data.error,
        category: data.category,
      });
      setCode(data.code);
      setLanguage(data.language);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getreport(repo_id);
  }, []);

  

  return (
    <div className=" h-fit  overflow-auto no-scrollbar">
      <Navbar />
      {loading && (<div className="fixed h-screen w-screen inset-0  flex items-center justify-center z-50">
        {/* <div className={`h-1/2 w-1/2 ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded p-4 relative border transition-all ease-in-out duration-1000`}>

        </div> */}
        <GradientCircularProgress />
        

      </div>
      )}
      {loading && (<div className="fixed h-screen w-screen inset-0 bg-black opacity-50 z-40"></div>)}

      <Toaster position="top-center" reverseOrder={false} />
      <div
        className={`${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"} transition-all ease-in-out duration-1000 mt-2 p-2 rounded`}
      >
        <h1 className="text-2xl font-bold mb-4">Repository Analysis</h1>

        <label htmlFor="repoLink">Github Profile Link / Username :</label>
        <input
          className="ml-2 border"
          onChange={handleChange}
          id="repoLink"
          type="text"
        />
        <button
          onClick={fetchRepositories}
          className={`ml-4 px-4 py-2 rounded ${mode === "dark" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"} transition-all ease-in-out duration-1000`}
        >
          Fetch Repositories
        </button>
      </div>



      {/* Repositories */}
      <div 
      className={`${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"} transition-all ease-in-out duration-1000 mt-2 p-2 rounded`}
      >
        {Repositories.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center">
              <Image
                className={` border-2 rounded-full p-1 transition-all ease-in-out duration-1000 ${mode === "dark" ? "border-gray-300" : "border-gray-700"}`}
                src={`${Repositories[0].owner.avatar_url}`}
                alt="Repository Icon"
                width={50}
                height={50}
              />
              <span className="ml-2 text-2xl font-bold">
                {Repositories[0].owner.login}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2">Fetched Repositories:</h2>
            <ul className="flex flex-wrap justify-left gap-y-5">
              {Repositories.map((repo: any) => (
                <li
                  key={repo.id}
                  className={`ml-4 border cursor-pointer rounded-sm h-fit p-5 w-31/100 transition-all ease-in-out duration-1000 hover:scale-105 ${mode === "dark" ? "bg-gray-700 " : "bg-gray-200 "}`}
                  onClick={() => getRepoContents(repo.path || "", repo.name, repo.owner.login)}
                >
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    <h3 className="text-lg">{repo.name}</h3>
                  </Link>
                  <p className="text-md ">{repo.description}</p>
                  <div className="flex w-full flex-wrap mt-2">
                    <p className="text-xs w-1/2 ">
                      Last updated:{" "}
                      {new Date(repo.updated_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs w-1/2 ">Type: {repo.owner.type}</p>
                    <p className="text-xs w-1/2 ">
                      Visibility: {repo.private ? "Private" : "Public"}
                    </p>
                    <p className="text-xs w-1/2 ">
                      Stars: {repo.stargazers_count}
                    </p>
                    <p className="text-xs w-1/2 ">Forks: {repo.forks_count}</p>
                    <p className="text-xs w-1/2 ">Language: {repo.language}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {Repositories.length === 0 && (
          <p className="mt-4">
            No repositories fetched yet. Please enter a GitHub profile link and
            click "Fetch Repositories".
          </p>
        )}
      </div>
      {/* Repository Content */}
      <div 
      className={`${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"} transition-all ease-in-out duration-1000 mt-2 p-2 rounded`}>
        {RepositoryContent.success  && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">{RepositoryContent.owner}/{RepositoryContent.name} Content:</h2>
            <p className="text-md mb-2">
              Fetched {RepositoryContent.totalFiles} files for repository "{RepositoryContent.name}".
            </p>
            <ul className="flex flex-wrap justify-left gap-y-5">
              {RepositoryContent.files.map((item: any) => (
                <li
                  key={item.path}
                  className={`ml-4 border cursor-pointer rounded-sm h-fit p-5 w-31/100 transition-all ease-in-out duration-1000 hover:scale-105 ${mode === "dark" ? "bg-gray-700 " : "bg-gray-200 "}`}
                  onClick={() =>
                    window.open(item.html_url, "_blank", "noopener,noreferrer")
                  }
                >
                  <h3 className="text-lg">{item.name}</h3>
                  <p className="text-md ">{item.path}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
