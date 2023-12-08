'use client'

import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'

function FormSwitcher({ checkUserInfo, setCardAuthLink }) {
    const [currentForm, setCurrentForm] = useState('login')
  return (
    <div className='bg-white p-5 rounded shadow max-w-2xl space-y-4 mx-auto'>
        <div className='flex justify-center gap-4'>
            <button onClick={() => setCurrentForm('login')} className={currentForm === 'login' ? 'border border-green-600 px-6 py-2 font-semibold cursor-pointer' : 'border px-6 py-2 font-semibold cursor-pointer'}>Log In</button>
            <button onClick={() => setCurrentForm('signup')} className={currentForm === 'signup' ? 'border border-green-600 px-6 py-2 font-semibold cursor-pointer' : 'border px-6 py-2 font-semibold cursor-pointer'}>Sign Up</button>
        </div>

        <div>
            {
                currentForm === 'login' ?
                <Login checkUserInfo={checkUserInfo} /> :
                <Signup checkUserInfo={checkUserInfo} setCardAuthLink={setCardAuthLink} />
            }
        </div>
    </div>
  )
}

export default FormSwitcher