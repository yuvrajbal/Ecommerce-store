"use client"
import { signOut, useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import React from "react"
import Navigation from "./nav"
export default function Container ({children}) {
  const { data:session } = useSession();
    if (!session)  {
      return(
      <div className="w-full text-center">
        <h1 className="mt-4">You are not signed in </h1>
        <button onClick ={()=> signIn("google")} className=" bg-white border-2 rounded-lg border-gray-900 px-4 py-1 mt-4">Sign in with Google</button>
        </div>);
      }
    return(
      <div className="bg-blue-900 min-h-screen flex" >
          <Navigation/>
          <div className="flex flex-grow flex-col bg-white rounded-lg m-4 ml-0">
            <div className= "p-4">
              {/* <p className="">Signed in as: {session.user?.email}</p> */}
              {children}
              
            </div>
          </div>
      </div>
    );
  }
 