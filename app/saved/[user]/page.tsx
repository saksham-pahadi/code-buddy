"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Image from "next/image"

type SavedItem = {
  id: string
 response: any
  createdAt: string
  category: string
  saved: boolean
}

const Page = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const mode = useSelector((state: RootState) => state.theme.mode)
  const [loading, setloading] = useState(false)

  const [saved, setSaved] = useState<SavedItem[]>([])

  const getSavedReports = async () => {
    try {
      const res = await fetch("/api/getsaved", {
        method: "POST",
        body: JSON.stringify({ email: session?.user?.email }),
      })

      const data = await res.json()
      console.log("saved reports:", data)

      setSaved(data.history || [])
    } catch (err) {
      console.log(err)
    }
  }

  

  useEffect(() => {
    if (session?.user?.email) {
      getSavedReports()
    }
  }, [session])

  const toggleSave = async (id: string, currentState: boolean) => {
   

    
    const res = await fetch("/api/togglesave", {
      method: "POST",
      body: JSON.stringify({
        id,
        email: session?.user?.email,
        saved: !currentState, // toggle
      }),
    });
  
    
  
    // update UI instantly remove from saved list
    setSaved(prev =>
      prev.filter(item => item.id !== id)
    );
  };

  return (
    <div className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all duration-1000 overflow-y-auto`}>
      <Navbar />

      <div className="flex justify-between items-center mt-1">

      <h1 className="text-2xl font-bold mb-4">Saved Reports</h1>
      <h1 className="text-2xl font-bold mb-4">{saved.length} Reports</h1>
</div>

      {!loading && (<div>

      
        {saved.length === 0 ? (
        <p>No saved reports found.</p>
      ) : (
        <ul className="space-y-4">
          {saved.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 border rounded">
              
              {/* LEFT */}
              <div className="w-1/3">
                <h2 className="text-lg font-semibold">{item.response.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              {/* MIDDLE */}
              <div className="w-1/3 text-center">
                <h2 className="text-md font-semibold">Report Type</h2>

                {item.category === "cp" && (
                  <p className="text-sm text-gray-500">Written</p>
                )}

                {item.category === "doc" && (
                  <p className="text-sm text-gray-500">Document</p>
                )}

                {item.category === "repo" && (
                  <p className="text-sm text-gray-500">Github Repository</p>
                )}
              </div>

              {/* RIGHT */}
              <div className="flex gap-3 w-1/3 justify-end">
                <button
                  onClick={() => router.push(`/cp/${item.id}`)}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  <Image title="view" src="/view.svg" alt="View" width={30} height={30} />
                </button>

                <button
                  onClick={() => toggleSave(item.id, item.saved)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Image title="Unsaved" src="/delete.svg" alt="Remove" width={30} height={30} />
                </button>
              </div>

            </div>
          ))}
        </ul>
      )}
      </div>)}
      {loading && <p>Loading...</p>}
    </div>
  )
}

export default Page