'use client'

import Dashboard from "@/components/Dashboard";
import FormSwitcher from "@/components/FormSwitcher";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  const checkUserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem("user_info"))

    return setUser(userInfo)
  }

  // set user on initial page load
  useEffect(() => {
    checkUserInfo()
  }, [])

  return (
    <div className='p-4 h-screen w-screen overflow-hidden'>
      {!user ? <FormSwitcher checkUserInfo={checkUserInfo} /> : <Dashboard checkUserInfo={checkUserInfo} />}
    </div>
  );
}
