"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Image from "next/image"

type HistoryItem = {
  id: string
  title: string
  category: string
  response: any
  createdAt: string
  saved: boolean
}

const Page = () => {
  const [saved, setsaved] = useState(false);
  const { data: session } = useSession()
  const router = useRouter()
  const mode = useSelector((state: RootState) => state.theme.mode)

  const [history, setHistory] = useState<HistoryItem[]>([])

  const getHistory = async () => {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        body: JSON.stringify({ email: session?.user?.email }), // ✅ FIXED
      })

      const data = await res.json()
      console.log("history data:", data)

      setHistory(data.history || [])
    } catch (err) {
      console.log(err)
    }
  }

  const RemoveHistory = async (id: string) => {
    try {
      const res = await fetch("/api/history/remove", {
        method: "POST",
        body: JSON.stringify({ id, email: session?.user?.email }), // ✅ FIXED
      })

      const data = await res.json()
      console.log(data)

      setHistory(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (session?.user?.email) {
      getHistory()
    }
  }, [session])

  // 🧠 category → readable label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "cp":
        return "Written"
      case "file":
        return "Source File"
      case "repo":
        return "GitHub Repository"
      default:
        return "Unknown"
    }
  }

  const toggleSave = async (id: string, currentState: boolean) => {
    const res = await fetch("/api/togglesave", {
      method: "POST",
      body: JSON.stringify({
        id,
        email: session?.user?.email,
        saved: !currentState, // toggle
      }),
    });
  
    const data = await res.json();
  
    // update UI instantly
    setHistory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, saved: !currentState } : item
      )
    );
  };

  return (
    <div className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all duration-1000 overflow-y-auto`}>
      <Navbar />

      <h1 className="text-2xl font-bold mb-4">Analysis History</h1>

      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 border rounded">
              
              {/* LEFT */}
              <div>
                <h2 className="text-lg font-semibold">{item.response.title || "Untitled Report"}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              {/* CATEGORY */}
              <div className="text-center">
                <h2 className="text-md font-semibold">Report Type</h2>
                <p className="text-sm text-gray-500">
                  {getCategoryLabel(item.category)}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/report/${item.id}`)} // ✅ FIXED ROUTE
                  className="text-blue-500 hover:text-blue-700"
                >
                  View
                </button>
                 <button className={` cursor-pointer ${mode === "dark" ? "invert" : ""} transition-all ease-in-out duration-1000`} onClick={() => {setsaved(!item.saved), toggleSave(item.id, item.saved)}}>
                        
                        
                        <Image title={`${item.saved ? "UnSave" : "Save"}`} src={`${item.saved ? "/saved.svg" : "/saves.svg"}`} alt="Save" width={30} height={30} />
                      </button>

                <button
                  onClick={() => RemoveHistory(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

            </div>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Page