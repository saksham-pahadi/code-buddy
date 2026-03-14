"use client"
import React from 'react'
import Navbar from '@/components/Navbar';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";

const page = () => {
    const params = useParams();
    const mode = useSelector((state: RootState) => state.theme.mode);
  return (
    <div className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all ease-in-out duration-1000 overflow-y-auto`}>
      <Navbar />
      repo page
      <h1>Repo ID: {params.repo_id}</h1>
    </div>
  )
}

export default page
