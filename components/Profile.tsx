import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { redirect } from 'next/navigation'
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import Image from "next/image";

const Profile = () => {
  const { data: session } = useSession()
  const mode = useSelector((state: RootState) => state.theme.mode);

  

  return (<div className='flex items-center justify-center h-4/5  '>
    {!session && (
      <div className='flex flex-col items-center justify-center h-full gap-4 z-5'>
        <h1 className='text-2xl font-bold'>Welcome to Code Buddy</h1>
        <p className='text-center'>Sign in or login to get started</p>
        <button className='flex items-center justify-center gap-2 border rounded-full p-3' onClick={() => signIn('github')}>
          <Image src="/github.png" alt="GitHub" width={30} height={30} />
          Sign in with GitHub
        </button>
        <button className='flex items-center justify-center gap-2 border rounded-full p-3' onClick={() => signIn('google')}>
          <Image src="/google.png" alt="Google" width={30} height={30} />
          Sign in with Google
        </button>
      </div>
    )}
    {session && (
      <div className={`flex flex-col items-center justify-center h-full gap-4 z-5 ${mode === "dark" ? "text-white" : "text-black"}`}>
        <Image className={`rounded-full border p-1 ${mode === "dark" ? "border-white" : "border-black"}`} src={session.user?.image || "/user.svg"} alt="Profile" width={100} height={100} />
        <h1>Welcome, {session.user?.name}!</h1>
        <p>Email: {session.user?.email}</p>
        <p>Username: {session.user?.email?.split("@")[0]}</p>
        <button className='cursor-pointer border border-red-500 text-red-500 p-3 px-4 rounded-2xl flex items-center gap-2' onClick={() => signOut()}>
          <Image src="/logout.svg" alt="Logout" width={24} height={24} />
          Sign Out
        </button>
      </div>
    )}
    
  </div>
  )
}

export default Profile
