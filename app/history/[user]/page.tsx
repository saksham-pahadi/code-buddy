"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import GradientCircularProgress from "@/components/GradientCircularProgress";
import toast, { Toaster } from "react-hot-toast";

type HistoryItem = {
  id: string;
  title: string;
  category: string;
  response: any;
  createdAt: string;
  updatedAt: string;
  saved: boolean;
  language: string;
};

const Page = () => {
  const [saved, setsaved] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [loading, setloading] = useState(true);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const getHistory = async () => {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        body: JSON.stringify({ email: session?.user?.email }), // ✅ FIXED
      });

      const data = await res.json();
      // console.log("history data:", data);

      setHistory(data.history || []);
      setloading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const RemoveHistory = async (id: string) => {
    try {
      const res = await fetch("/api/history/remove", {
        method: "POST",
        body: JSON.stringify({ id, email: session?.user?.email }), // ✅ FIXED
      });

      const data = await res.json();
      // console.log(data);

      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      getHistory();
    }
  }, [session]);

  // 🧠 category → readable label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "cp":
        return "Written";
      case "doc":
        return "Document";
      case "repo":
        return "GitHub Repository";
      default:
        return "Unknown";
    }
  };

  const toggleSave = async (id: string, currentState: boolean) => {
    const res = await fetch("/api/togglesave", {
      method: "POST",
      body: JSON.stringify({
        id,
        email: session?.user?.email,
        category: history.find((item) => item.id === id)?.category,
        saved: !currentState, // toggle
      }),
    });

    const data = await res.json();

    // update UI instantly
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, saved: !currentState } : item,
      ),
    );
  };

  return (
    <div
      className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all duration-1000 overflow-y-auto`}
    >
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center mt-1">
        <h1 className="text-2xl font-bold mb-4">Analysis History</h1>
        <h1 className="text-2xl font-bold mb-4">{history.length} Reports</h1>
      </div>

      {!loading && (
        <div>
          {history.length === 0 ? (
            <p>No history found.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  {/* LEFT */}
                  <div className="w-5/10 cursor-default justify-start">
                    <h2 className="text-lg font-semibold">
                      {item.response.title || "Untitled Report"}
                    </h2>
                    <p className="text-sm font-semibold text-gray-500">
                      Language: {item.language.toLocaleUpperCase()}
                    </p>
                  </div>
                  {/* Time*/}
                  <div className="w-3/10 cursor-default justify-start">
                    <h2 className="text-md font-semibold">
                      Last Updated:{" "}
                      <span className="text-gray-500 text-sm">
                        MM/DD/YYYY, Time
                      </span>{" "}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(item.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  {/* CATEGORY */}
                  <div className="text-center w-1/10 cursor-default justify-center">
                    <h2 className="text-md font-semibold">Report Type</h2>
                    <p className="text-sm text-gray-500">
                      {getCategoryLabel(item.category)}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 w-1/10 justify-end">
                    <button
                      onClick={() => {
                        if (item.category === "cp") {
                          router.push(`/cp/${item.id}`);
                        } else if (item.category === "doc") {
                          router.push(`/doc/${item.id}`);
                        } else if (item.category === "repo") {
                          router.push(`/repo/${item.id}`);
                        }
                      }}
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                    >
                      <Image
                        className={`${mode === "dark" ? "invert" : ""} transition-all duration-1000 ease-in-out`}
                        title="View"
                        src="/view.svg"
                        alt="View"
                        width={30}
                        height={30}
                      />
                    </button>

                    <button
                      onClick={() => RemoveHistory(item.id)}
                      className="text-red-500 hover:text-red-700  cursor-pointer"
                    >
                      <Image
                        className={`${mode === "dark" ? "invert" : ""} transition-all duration-1000 ease-in-out`}
                        title="Delete"
                        src="/delete.svg"
                        alt="Delete"
                        width={30}
                        height={30}
                      />
                    </button>
                    <button
                      className={` cursor-pointer ${mode === "dark" ? "invert" : ""} transition-all ease-in-out duration-1000`}
                      onClick={() => {
              toast.promise(toggleSave(item.id, item.saved), {
                loading: "Saving...",
                success: (
                  <b>{`Report ${item.saved ? "unsaved" : "saved"} successfully!`}</b>
                ),
                error: <b>Failed to save report.</b>,
              });
            }}
                    >
                      <Image
                        className={`${mode === "dark" ? "invert" : ""} transition-all duration-1000 ease-in-out`}
                        title={`${item.saved ? "UnSave" : "Save"}`}
                        src={`${item.saved ? "/saved.svg" : "/saves.svg"}`}
                        alt="Save"
                        width={30}
                        height={30}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>
      )}
      {loading && (
        <div className="fixed h-screen w-screen inset-0  flex items-center justify-center z-50">
          {/* <div className={`h-1/2 w-1/2 ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded p-4 relative border transition-all ease-in-out duration-1000`}>

        </div> */}
          <GradientCircularProgress />
        </div>
      )}
      {loading && (
        <div className="fixed h-screen w-screen inset-0 bg-black opacity-50 z-40"></div>
      )}
    </div>
  );
};

export default Page;
