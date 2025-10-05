'use client'
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { User } from "next-auth";
const Navbar = () => {
  const { data: session } = useSession();
  
  const user = session?.user as User

  return (
    <div>
      
    </div>
  )
}

export default Navbar
