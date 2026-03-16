"use client"
import React from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import Navbar from '@/components/Navbar';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const page = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const mode = useSelector((state: RootState) => state.theme.mode);
  return (
    <div className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all ease-in-out duration-1000 overflow-y-auto`}>
      <Navbar />
      settings
    </div>
  )
}

export default page