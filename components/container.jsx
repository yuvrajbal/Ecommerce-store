"use client"
import { signOut, useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import React, { useState } from "react"
import Navigation from "./nav"
import Logo from "./Logo"
export default function Container ({children}) {
  const [showNav, setShowNav] = useState(false);
  const { data:session } = useSession();
    if (!session)  {
      return(
      <div className="bg-bgGray w-screen text-center">
        <h1 className="mt-4">You are not signed in </h1>
        <button onClick ={()=> signIn("google")} className=" bg-white border-2 rounded-lg border-gray-900 px-4 py-1 mt-4">Sign in with Google</button>
        </div>);
      }

    
    return(
      <div className="bg-bgGray min-h-screen">
        <div className="md:hidden flex p-4">
          <button onClick={() => setShowNav(true)}> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
            </svg>
          </button>
          <div className="flex grow justify-center mr-6">
            <Logo/>
          </div>
        </div>  
        <div className="flex" >
            <Navigation show={showNav}/>
            <div className="flex-grow p-4">
              
                {/* <p className="">Signed in as: {session.user?.email}</p> */}
                {children}
           
            </div>
        </div>
        </div>
    );
  }
 