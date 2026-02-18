"use client";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Workspace from "@/components/Workspace";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function Home() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  return (
    <div
      className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all ease-in-out duration-1000 overflow-y-auto`}
    >
      
        <Navbar />
         {/* <div className={`saperator h-px ${mode !== "dark" ? "bg-gray-700" : "bg-gray-300"} transition-all ease-in-out duration-1000 opacity-50`}></div> */}
        <Workspace />
    </div>
  );
}
