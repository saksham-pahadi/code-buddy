"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import Typewriter from "typewriter-effect";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  const router = useRouter();

  const gotoCopyPaste = () => {
  const id = uuidv4();
  router.push(`/cp/${id}`);
};
  const gotoFileUpload = () => {
  const id = uuidv4();
  router.push(`/doc/${id}`);
};
  const gotoShareRepo = () => {
  const id = uuidv4();
  router.push(`/repo/${id}`);
};


  const mode = useSelector((state: RootState) => state.theme.mode);
  const highlights = [
    "welcome to codebuddy!",
    "codebuddy is an ai-powered code search and recommendation tool designed to help developers find relevant code snippets, documentation, and resources quickly and efficiently. with codebuddy, you can easily search for code examples, best practices, and solutions to common programming problems, all within a user-friendly interface. whether you're a beginner looking for guidance or an experienced developer seeking inspiration, codebuddy has got you covered!",
  ];
  const introTiles = [
    "Understand your code. Optimize it. Level up your development.",
    "AI-powered insights for better code.",
    "Paste code. Get instant analysis.",
    "Your smart assistant for cleaner, faster, and safer code.",
  ];

  return (
    <div
      className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all ease-in-out duration-1000 overflow-y-auto`}
    >
      <Navbar />
      <div
        className={` p-4  ${mode === "dark" ? "bg-black text-gray-300" : "bg-white text-gray-600"} h-9/10 mt-2 flex flex-col border rounded justify-evenly transition-all ease-in-out duration-1000 `}
      >
        <h1 className="text-5xl bold font-mono cursor-default ">
          Welcome to CodeBuddy!
        </h1>
        <div className="text-3xl mt-4 bolf font-serif cursor-default">
          <Typewriter
            options={{
              strings: introTiles,
              autoStart: true,
delay: 30,
              loop: true,
            }}
          />
        </div>
         
  

        <p className=" mt-4 text-lg cursor-default">
          CodeBuddy is an ai-powered code search and recommendation tool
          designed to help developers find relevant code snippets,
          documentation, and resources quickly and efficiently. with CodeBuddy,
          you can easily search for code examples, best practices, and solutions
          to common programming problems, all within a user-friendly interface.
          whether you are a beginner looking for guidance or an experienced
          developer seeking inspiration, CodeBuddy has got you covered!
        </p>
        {/* <p className=" mt-10 text-3xl bolf font-serif">
          Get started today and experience the power of AI-driven code!
        </p> */}
        <p className=" mt-10 text-2xl text-left bolf font-serif cursor-default">
          Select an option below to begin:
        </p>
        <div className="mt-10 flex flex-wrap justify-evenly gap-4">
          <button onClick={gotoCopyPaste} className={`h-50 w-70 rounded ${mode === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-black"} transition duration-1000 px-4 py-2 hover:shadow-lg hover:border-2 hover:border-gray-500 hover:scale-110 flex flex-col items-center justify-center cursor-pointer`}>
            <Image className={`${mode === "dark" ? "invert" : ""} transition duration-1000 p-1 `} src="/code.png" alt="Copy" width={100} height={100} />
            Write a code snippet
          </button>
          <button onClick={gotoFileUpload} className={`h-50 w-70 rounded ${mode === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-black"} transition duration-1000 px-4 py-2 hover:shadow-lg hover:border-2 hover:border-gray-500 hover:scale-110 flex flex-col items-center justify-center cursor-pointer`}>
            <Image className={`${mode === "dark" ? "invert" : ""} transition duration-1000 p-1  `} src="/upload.png" alt="Upload" width={100} height={100} />
            Upload a file
          </button>
          <button onClick={gotoShareRepo} className={`h-50 w-70 rounded ${mode === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-black"} transition duration-1000 px-4 py-2 hover:shadow-lg hover:border-2 hover:border-gray-500 hover:scale-110 flex flex-col items-center justify-center cursor-pointer`}>
            <Image className={`${mode === "dark" ? "invert" : ""} transition duration-1000 p-1 `} src="/github.png" alt="Share" width={100} height={100} />
            Share a github repo
          </button>
          
        </div>
      </div>
    </div>
  );
}
