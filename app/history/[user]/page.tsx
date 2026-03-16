"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

type HistoryItem = {
  id: string
  title: string
  date: string
}

const Page = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const mode = useSelector((state: RootState) => state.theme.mode)

  const [history, setHistory] = useState<HistoryItem[]>([])

  const getHistory = async () => {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        body: JSON.stringify({ user: session?.user?.email }),
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
        body: JSON.stringify({ id, user: session?.user?.email }),
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

  return (
    <div className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all duration-1000 overflow-y-auto`}>
      <Navbar />

      <h1 className="text-2xl font-bold mb-4">Analysis History</h1>

      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex justify-between p-3 border rounded">
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/report/${item.id}`)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View
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