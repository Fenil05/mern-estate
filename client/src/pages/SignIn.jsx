import React, { useState } from 'react'
import {Link,useNavigate} from "react-router-dom"
import apiRequest from '../utils/apiRequest'

const SignIn = () => {
  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [formData,setFormData] = useState({})

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await apiRequest.post("auth/signin",formData)
      setLoading(false)
      navigate("/")
    } catch (err) {
      setError(err.response.data.message)
      setLoading(false)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button
        disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't Have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>

  )
}

export default SignIn