'use client'

import { useState } from "react"

function Login({ checkUserInfo }) {
    const [userData, setUserData] = useState({
        email: 'john@rapyd.net',
        password: '12345678'
    })

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const loginCustomer = async () => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
          })
    
          const data = await response.json()
    
          // alert if there is an error
          if(data.error){
            alert(data.error)
          }
  
          // store the returned info in local storage
          if(data.user){
            localStorage.setItem('user_info', JSON.stringify(data.user))
            checkUserInfo()
          }
        } catch (error) {
          console.error('error', error.message)
        }
      }
  return (
    <div className='bg-white p-5 rounded max-w-2xl space-y-4 mx-auto'>
        <div>
            <div className=''>
                <label className='block font-bold mb-2'>Email:</label>
                <input 
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className='w-full p-2 mb-2 border rounded focus:outline-none' 
                    type="email" 
                    required 
                />
            </div>

            <div className=''>
                <label className='block font-bold mb-2'>Password:</label>
                <input 
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    className='w-full p-2 mb-2 border rounded focus:outline-none' 
                    type="password" 
                    required 
                />
            </div>
        </div>
    
        <div className='flex items-center justify-center'>
          <button onClick={() => loginCustomer()} className='bg-green-600 text-white px-6 py-2 cursor-pointer rounded'>Login</button>
        </div>
      </div>
  )
}

export default Login