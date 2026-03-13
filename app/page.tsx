"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import WorkspacePaste from "@/components/WorkspacePaste";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  
  
  

  return (
    <div
      className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all ease-in-out duration-1000 overflow-y-auto`}
    >
      <Navbar />

      {/* <div className={`saperator h-px ${mode !== "dark" ? "bg-gray-700" : "bg-gray-300"} transition-all ease-in-out duration-1000 opacity-50`}></div> */}
      {/* <WorkspacePaste /> */}
    </div>
  );
}
