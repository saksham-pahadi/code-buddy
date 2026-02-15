"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { toggleTheme } from "@/store/themeSlice";
import Image from "next/image";


const Navbar = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-between w-full h-16 transition-all ease-in-out duration-2000 ">
      <button
        onClick={() => dispatch(toggleTheme())}
        className={`px-4 py-2 rounded ${mode === "dark" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"}`}
      >
        <p>Switch to {mode === "dark" ? "☀️" : "🌙"}</p>
      </button>
      <Image className={`${mode==="dark" ? "invert" : ""} transition-all ease-in-out duration-1000`} src="/CodeBuddy.png" alt="Logo" width={100} height={50} />

      <div className="flex items-center justify-between gap-2 h-full ">
        <button><Image title="Share Chat" className={` ${mode === "dark" ? "invert " : ""} transition-all ease-in-out duration-1000 hover:bg-gray-200 p-1 rounded-full`} src="/share.svg" alt="Share Icon" width={40} height={40} /></button>
        <button className="px-4 py-2  text-white rounded ">
          <Image title="Temp Chat" className={` ${mode === "dark" ? "invert" : ""} transition-all ease-in-out duration-1000 hover:bg-gray-200 p-1 rounded-full`} src="/chat.svg" alt="Share Icon" width={40} height={40} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
