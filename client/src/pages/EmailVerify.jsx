import React, { useContext, useEffect, useRef } from 'react'
import assets from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const EmailVerify = () => {

  axios.defaults.withCredentials = true
  const inputRefs = useRef([])
  const {backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContext)

  const navigate = useNavigate()
  
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index+1].focus()
    }
  }
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index-1].focus()
    }
  }
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('Text')
    const pastedDataArray = pastedData.split('')
    for (let i = 0; i < pastedDataArray.length; i++) {
      if(inputRefs.current[i]) {
        inputRefs.current[i].value = pastedDataArray[i]
        inputRefs.current[i].dispatchEvent(new Event('input'))
      }
    }
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const otpArray = inputRefs.current.map(event => event.value).join('')
      const otp = otpArray.join('')
      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', otp)
      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
}, [isLoggedIn, userData, navigate])

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6 digit code sent to your email id.</p>

        <div className='flex justify-between mb-8 '>
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength='1' key={index} required className='w-12 h-12 text-white text-center text-xl rounded-md bg-[#333A5C]'
            ref={e => inputRefs.current[index] = e} onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)} onPaste={handlePaste}/>
          ))}
        </div>
        <button className='w-full bg-indigo-500 text-white py-2 rounded-full hover:bg-indigo-600 transition-all'>Verify email</button>
      </form>
    </div>
  )
}

export default EmailVerify
