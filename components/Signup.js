'use client'

import { useState } from "react"

function Signup({ checkUserInfo }) {
    const [userData, setUserData] = useState({
        fullname: 'John Doe',
        email: 'john@rapyd.net',
        password: '12345678',
        country: 'US',
        address_line: '123 Main Street',
        zip_code: '12345',
        card_number: '4111111111111111',
        expiration_month: '12',
        expiration_year: '34',
        cvv: '123'
    })

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const createCustomer = async () => {
      try {
        const response = await fetch('/api/auth/signup', {
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

        {/* Personal Information */}
        <div>
          <h1 className="text-2xl text-center font-bold mb-3">Personal Information</h1>

          <div>
            <label className='block font-bold mb-2'>Full Name:</label>
            <input 
                name="fullname"
                value={userData.fullname}
                onChange={handleChange}
                className='w-full p-2 mb-2 border rounded focus:outline-none' 
                type="text" 
                required
            />
          </div>

          <div className='flex gap-4'>
            <div className='w-1/2'>
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

            <div className='w-1/2'>
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
        </div>

        {/* Address */}
        <div>
          <h1 className="text-2xl text-center font-bold mb-3">Address</h1>
          <div className='flex gap-4'>
            <div>
              <label className='block font-bold mb-2'>Country</label>
              <input 
                name="country"
                value={userData.country}
                onChange={handleChange}
                className='w-full p-2 mb-2 border rounded focus:outline-none' 
                type="text" 
                required
              />
            </div>
            <div>
              <label className='block font-bold mb-2'>Address Line:</label>
              <input
                name="address_line"
                value={userData.address_line}
                onChange={handleChange}
                className='w-full p-2 mb-2 border rounded focus:outline-none' 
                type="text" 
                required
              />
            </div>
            <div>
              <label className='block font-bold mb-2'>Zip Code:</label>
              <input
                name="zip_code"
                value={userData.zip_code}
                onChange={handleChange}
                className='w-full p-2 mb-2 border rounded focus:outline-none' 
                type="text" 
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h1 className="text-2xl text-center font-bold mb-3">Payment Information</h1>

          <div>
            <div>
              <label className='block font-bold mb-2'>Card Number:</label>
                <input
                    name="card_number"
                    value={userData.card_number}
                    onChange={handleChange}
                    className='w-full p-2 mb-2 border rounded focus:outline-none' 
                    type="text" 
                    required
                />
            </div>

            <div className='flex gap-4'>
              <div>
                <label className='block font-bold mb-2'>Expiration Month:</label>
                <input
                    name="expiration_month"
                    value={userData.expiration_month}
                    onChange={handleChange}
                    className='w-full p-2 mb-2 border rounded focus:outline-none' 
                    type="text" 
                    required
                />
              </div>

              <div>
                <label className='block font-bold mb-2'>Expiration Year:</label>
                <input
                    name="expiration_year"
                    value={userData.expiration_year}
                    onChange={handleChange}
                    className='w-full p-2 mb-2 border rounded focus:outline-none' 
                    type="text" 
                    required
                />
              </div>

              <div>
                <label className='block font-bold mb-2'>CVV:</label>
                <input
                    name="cvv"
                    value={userData.cvv}
                    onChange={handleChange}
                    className='w-full p-2 mb-2 border rounded focus:outline-none' 
                    type="text" 
                    required
                />
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center'>
          <button onClick={() => createCustomer()} className='bg-green-600 text-white px-6 py-2 cursor-pointer rounded'>Sign Up</button>
        </div>
      </div>
  )
}

export default Signup