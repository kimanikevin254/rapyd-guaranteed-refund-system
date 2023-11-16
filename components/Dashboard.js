'use client'

import React from 'react'

function Dashboard({ checkUserInfo }) {

    const logout = () => {
        console.log('logout')
        localStorage.removeItem('user_info')
        checkUserInfo()
    }
  return (
    <div className="bg-white p-5 rounded shadow max-w-[600px] w-full mx-auto mt-8">
        <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold'>Subscription Dashboard</h2>
            <button onClick={() => logout()} className='border px-4 py-1 cursor-pointer'>Log out</button>
        </div>

        <div className="mb-5">
            <h3>Your Subscription</h3>
            <p><strong>Plan:</strong> CineView Unlimited - Weekly Plan</p>
            <p><strong>Status:</strong> Active</p>

            <button className="mt-4 bg-red-600 text-white rounded cursor-pointer px-6 py-2">Cancel Subscription</button>
        </div>
    </div>
  )
}

export default Dashboard