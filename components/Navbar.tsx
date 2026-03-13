"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setDark, setLight, toggleTheme } from "@/store/themeSlice";
import Image from "next/image";

const Navbar = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

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
      <button
        onClick={() => {
          const newTheme = mode === "light" ? "dark" : "light";
          dispatch(toggleTheme());
          localStorage.setItem("theme", newTheme);
        }}
        className={`px-4 py-2 rounded ${mode === "dark" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"}`}
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
    </div>
  );
};

export default Navbar;