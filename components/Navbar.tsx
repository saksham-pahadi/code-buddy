"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setDark, setLight, toggleTheme } from "@/store/themeSlice";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [openShare, setopenShare] = useState(false)
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  


  const copylink = () => {
    setopenShare(true);
    let link = "";
    if(pathname.includes("/cp/")){
      link = `${window.location.origin}/cp/${pathname.split("/cp/")[1]}`
    }
    else if(pathname.includes("/doc/")){
      link = `${window.location.origin}/doc/${pathname.split("/doc/")[1]}`
    }
    else if(pathname.includes("/repo/")){
      link = `${window.location.origin}/repo/${pathname.split("/repo/")[1]}`
    }
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
    setopenShare(false);
  };


  const openTemp = () => {
   if(pathname.includes("/cp/")){
     window.open(`/cp/temp`, '_blank', 'noopener,noreferrer');
   }
   else if(pathname.includes("/doc/")){
      window.open(`/doc/temp`, '_blank', 'noopener,noreferrer');
   }
   else if(pathname.includes("/repo/")){
      window.open(`/repo/temp`, '_blank', 'noopener,noreferrer');
   }

  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    console.log("Saved theme:", savedTheme);

    if (savedTheme === "dark") {
      dispatch(setDark());
    } else if (savedTheme === "light") {
      dispatch(setLight());
    }
  }, [dispatch]);


  return (
    <div className={`flex sticky top-0 z-10 border-b-2 items-center justify-between w-full h-16 transition-all ease-in-out duration-1000 ${mode === "dark" ? "bg-black text-white border-gray-700" : "bg-white text-black border-gray-300"}`}>
      <Toaster 
      position="top-center"
      reverseOrder={false}
      />
      <button
        onClick={() => {
          const newTheme = mode === "light" ? "dark" : "light";
          dispatch(toggleTheme());
          localStorage.setItem("theme", newTheme);
        }}
        className={`px-4 py-2 rounded ${mode === "dark" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"} cursor-pointer transition-all ease-in-out duration-1000`}
      >
        Switch to {mode === "dark" ? "☀️" : "🌙"}
      </button>

      <Image
        className={`${mode === "dark" ? "invert" : ""} transition-all duration-1000`}
        src="/CodeBuddy.png"
        alt="Logo"
        width={100}
        height={50}
      />
      <div className="flex gap-2">
        <button onClick={()=>{copylink()}}>
          <Image
            className={`${mode === "dark" ? "invert" : ""} transition duration-1000 p-1 hover:bg-gray-400 rounded-full cursor-pointer`}
            title="Share"
            src="/share.svg"
            alt="Share"
            width={40}
            height={40}
          />
        </button>
        {pathname.includes("/cp/") || pathname.includes("/doc/") || pathname.includes("/repo/") ? (
          <button onClick={openTemp}>
            <Image
              className={`${mode === "dark" ? "invert" : ""} transition duration-1000 p-1 hover:bg-gray-400 rounded-full cursor-pointer`}
              title="Temp Analysis"
              src="/chat.svg"
              alt="tempChat"
            width={40}
            height={40}
          />
        </button>) : null}
      </div>
      {openShare && (<div className={` fixed h-screen w-screen inset-0  flex items-center justify-center z-50`}>
              <div className={`h-1/2 w-1/2 ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded p-4 relative border transition-all ease-in-out duration-1000`}>
      <Image className={`${mode === "dark" ? "invert" : ""} font-bold border rounded inline p-2 self-end cursor-pointer`} onClick={()=>{setopenShare(!openShare)}} src="/cross.svg" alt="Close" width={50} height={50} />
              
              <h2>Share this report</h2>
              </div>
              </div>
      )}
      {openShare && (<div className="fixed h-screen w-screen inset-0 bg-black opacity-50 z-40"></div>)}
    </div>
  );
};

export default Navbar;