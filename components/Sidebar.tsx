"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import Link from "next/link";
// import { Button } from "@geist-ui/react";
import Image from "next/image";
import Profile from "./Profile";
import { useSession } from "next-auth/react"

const Sidebar = () => {
  const [viewProfile, setviewProfile] = useState(false);
  const { data: session } = useSession();
  const [profilePic, setprofilePic] = useState("/user.svg")
  useEffect(() => {
  if (session?.user?.image) {
    setprofilePic(session.user.image)
  }
}, [session])
  const mode = useSelector((state: RootState) => state.theme.mode);
  const options: { name: string; icon: string; path: string }[] = [
    { name: "New Analysis", icon: "/add.svg", path: "/" },
    { name: "Analysis History", icon: "/history.svg", path: "/history" },
    { name: "Saved Reports", icon: "/save.svg", path: "/saved" },
    { name: "Settings", icon: "/setting.svg", path: "/settings" },
    { name: "Help", icon: "/help.svg", path: "/help" },
  ];

  return (
    <div
      className={`${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"} flex flex-col justify-between h-screen w-10/100 md:w-17/100 transition-all ease-in-out duration-1000 p-2`}
    >
      <div>

      
      <div className={`h-14 flex items-center justify-between px-4`}>
        <Image className={`${mode==="dark" ? "invert" : ""} transition-all ease-in-out duration-1000`} src="/CB.png" alt="Logo" width={50} height={50} />
        {/* <Image className={`${mode==="dark" ? "invert" : ""} transition-all ease-in-out duration-1000`} src="/sidebar.svg" alt="Sidebar Icon" width={25} height={25} /> */}
        
      </div>
      <div className={`saperator h-px ${mode !== "dark" ? "bg-gray-700" : "bg-gray-300" } transition-all ease-in-out duration-1000  opacity-25`}></div>
      <ul className={`flex flex-col gap-4 px-2 py-2`}>
        {
          options.map((option) => (
            <Link key={option.name} className={`${mode === "dark" ? "hover:text-gray-800" : " hover:text-white" } hover:bg-gray-400  p-2 rounded flex items-center`} href={option.path}>
              <Image className={`${mode === "dark" ? "invert" : " " } transition-all ease-in-out duration-1000`}  src={option.icon} alt="Logo" width={30} height={30} />
              <p className="ml-2">{option.name}</p>
            </Link>
          ))}
      </ul>
      </div>
      <div className="">
        {!session && (
          <button onClick={() => setviewProfile(true)} className={`h-10 w-full bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center transition-all ease-in-out duration-1000 cursor-pointer`}>
            <p className={`text-sm`}>Login / Sign Up</p>
          </button>
        )}
        {session && (
          <button onClick={() => setviewProfile(true)} className={`flex items-center h-14 w-full rounded-full ${mode === "dark" ? "hover:text-gray-800" : " hover:text-white" } hover:bg-gray-400  p-2 rounded cursor-pointer`} >
            <Image className={` transition-all ease-in-out duration-1000 p-0.5 border ${mode==="dark" ? "border-white" : "border-black"} rounded-full mx-1`} src={profilePic} alt="Upgrade Icon" width={40} height={40} />
            <p >{session?.user?.name}</p>
          </button>
        )}
        <p className={`text-md my-2`}>© 2026 Code Buddy</p>
        <div className={`saperator h-px ${mode !== "dark" ? "bg-gray-700" : "bg-gray-300"} opacity-25`}></div>
       <button className="h-10 w-full mt-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full cursor-pointer">
          <p className={`text-sm`}>Upgrade</p>
        </button>
      </div>

      {viewProfile && (<div className="fixed h-screen w-screen inset-0  flex items-center justify-center z-50">
        <div className={`h-1/2 w-1/2 ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded p-4 relative border transition-all ease-in-out duration-1000`}>
<Image className={`${mode === "dark" ? "invert" : ""} font-bold border rounded inline p-2 self-end cursor-pointer`} onClick={()=>{setviewProfile(false)}} src="/cross.svg" alt="Close" width={50} height={50} />
        <Profile />
        </div>
        

      </div>
      )}
      {viewProfile && (<div className="fixed h-screen w-screen inset-0 bg-black opacity-50 z-40"></div>)}
      
    </div>
  );
};

export default Sidebar;
