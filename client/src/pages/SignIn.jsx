import React, { useState } from 'react'
import {Link,useNavigate} from "react-router-dom"
import apiRequest from '../utils/apiRequest'
import {useDispatch,useSelector} from "react-redux"
import { signInFailure,signInSuccess,signInStart } from '../redux/user/userSlice'

const SignIn = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData,setFormData] = useState({})
  const {loading,error} = useSelector((state) => state.user)

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    dispatch(signInStart())
    try {
      const res = await apiRequest.post("auth/signin",formData)
      dispatch(signInSuccess(res.data))
      navigate("/")
    } catch (err) {
      dispatch(signInFailure(err.response.data.message))
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