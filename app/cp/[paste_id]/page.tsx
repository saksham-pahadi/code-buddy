"use client"
import React from 'react'
import WorkspacePaste from "@/components/WorkspacePaste";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

const page = () => {
   const mode = useSelector((state: RootState) => state.theme.mode);
  return (
    <div className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all ease-in-out duration-1000 overflow-y-auto`}>
       
      <WorkspacePaste />

    </div>
  )
}

export default page
