import React,{useEffect, useRef, useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import {app} from "../firebase.js"
import { updateUserFailure,updateUserSuccess,updateUserStart,deleteUserFailure,deleteUserStart,deleteUserSuccess, signOutUserStart, signOutUserSuccess, signOutUserFailure} from '../redux/user/userSlice.js'
import apiRequest from "../utils/apiRequest.js"

const Profile = () => {
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const {currentUser,loading,error}  = useSelector((state) => state.user)
  const [formData,setFormData] = useState({})
  const [file,setFile] = useState(undefined)
  const [filePerc,setFilePerc] = useState(0)
  const [updateSuccess,setUpdateSuccess] = useState(false)
  const [fileUploadError,setFileUploadError] = useState(false)

  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  },[file])

  
  const handleFileUpload = (file)=>{
    const storage = getStorage(app)
    const filename = new Date().getTime() + file.name
    const storageRef = ref(storage,filename)
    const uploadTask = uploadBytesResumable(storageRef,file)

    uploadTask.on("state_changed",
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setFilePerc(Math.round(progress))
    },
    (error)=>{
      setFileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then(
        (downloadURL) => {
          setFormData({...formData, avatar:downloadURL})
        }
      )
    }
    )
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,[e.target.id]:e.target.value
    })
  }

  const handleSubmit =async(e) => {
    e.preventDefault()
    try {
      setUpdateSuccess(false)
      dispatch(updateUserStart())
      const res = await apiRequest.post(`user/update/${currentUser._id}`,formData)
      dispatch(updateUserSuccess(res.data))
      setUpdateSuccess(true)
    } catch (err) {
      dispatch(updateUserFailure(err.response.data.message))
    }
  }

  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart())
      const res = await apiRequest.delete(`user/delete/${currentUser._id}`)
      dispatch(deleteUserSuccess(res.data))
    } catch (err) {
      dispatch(deleteUserFailure(err.response.data.message))
    }
  }

  const handleSignOut = async() => {
    try {
      dispatch(signOutUserStart())
      const res = await apiRequest.post(`auth/signout`)
      dispatch(signOutUserSuccess())
    } catch (err) {
      dispatch(signOutUserFailure(err.response.data.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e)=>setFile(e.target.files[0])}
        />
        <img
          onClick={()=>fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? 
          <span className='text-red-700'>Error Image Upload(image must be less then 2mb)</span>
          : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) :
          filePerc === 100 ? (
            <span className='text-green-700'>Successfully uploaded!</span>
          ) : 
          ""
        }
        </p>
        <input
          type='text'
          placeholder='username'
          id='username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
          className='border p-3 rounded-lg'
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          onChange={handleChange}
          className='border p-3 rounded-lg'
        />
        <button
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span className='text-red-700 cursor-pointer'
        onClick={handleSignOut}
        >
          Sign out
        </span>
      </div>
      <button 
      className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>
        {error ? error : ""}
      </p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? "User updated successfully " : ""}
      </p>
      
    </div>

  )
}

export default Profile