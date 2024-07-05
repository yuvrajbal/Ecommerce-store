"use client"

import {signOut,  useSession } from "next-auth/react"
export default function Dashboard(){
  const {data : session} = useSession();  
  return (
      <div className="flex justify-between">
        <h2>Hello , <b>{session?.user?.name}</b> </h2>
        <div className="flex gap-1 rounded-lg overflow-hidden">
          <div className="flex items-center ">
            <img className="w-8 h-8 rounded-lg " src={session?.user?.image} alt="Profile Picture" />
          </div>
          {/* <button onClick ={()=> signOut()} className="border-2 border-blue-900  px-4 py-1 rounded-lg ">Sign out</button> */}
        </div>
      </div>

    );
}