"use client";
import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import Link from "next/link";
// import { Button } from "@geist-ui/react";
import Image from "next/image";

const Sidebar = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const options: { name: string; icon: string }[] = [
    { name: "New Analysis", icon: "/add.svg" },
    { name: "Analysis History", icon: "/history.svg" },
    { name: "Saved Reports", icon: "/save.svg" },
    { name: "Settings", icon: "/setting.svg" },
    { name: "Help", icon: "/help.svg" },
  ];

  return (
    <div
      className={`${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"} flex flex-col justify-between h-screen w-10/100 md:w-17/100 transition-all ease-in-out duration-1000 p-2`}
    >
      <div>

      
      <div className={`h-14 flex items-center justify-between px-4`}>
        <Image className={`${mode==="dark" ? "invert" : ""} transition-all ease-in-out duration-1000`} src="/CB.png" alt="Logo" width={50} height={50} />
        <Image className={`${mode==="dark" ? "invert" : ""} transition-all ease-in-out duration-1000`} src="/sidebar.svg" alt="Sidebar Icon" width={25} height={25} />
        
      </div>
      <div className={`saperator h-px ${mode !== "dark" ? "bg-gray-700" : "bg-gray-300" } transition-all ease-in-out duration-1000  opacity-25`}></div>
      <ul className={`flex flex-col gap-4 px-2 py-2`}>
        {
          options.map((option) => (
            <Link key={option.name} className={`${mode === "dark" ? "hover:text-gray-800" : " hover:text-white" } hover:bg-gray-400  p-2 rounded flex items-center`} href="/#">
              <Image className={`${mode === "dark" ? "invert" : " " } transition-all ease-in-out duration-1000`}  src={option.icon} alt="Logo" width={30} height={30} />
              <p className="ml-2">{option.name}</p>
            </Link>
          ))}
      </ul>
      </div>
      <div className="">
        <button className={`flex items-center h-14 w-full rounded-full ${mode === "dark" ? "hover:text-gray-800" : " hover:text-white" } hover:bg-gray-400  p-2 rounded`} >
          <Image className={`${mode === "dark" ? "invert " : " " } transition-all ease-in-out duration-1000 p-0.5 border border-black rounded-full mx-1`} src="/user.svg" alt="Upgrade Icon" width={30} height={30} />
          <p >Username</p>
        </button>
        <p className={`text-md my-2`}>© 2026 Code Buddy</p>
        <div className={`saperator h-px ${mode !== "dark" ? "bg-gray-700" : "bg-gray-300"} opacity-25`}></div>
       <button className="h-10 w-full mt-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full ">
          <p className={`text-sm`}>Upgrade</p>
        </button>
      </div>
      
    </div>
  );
};

export default Sidebar;
