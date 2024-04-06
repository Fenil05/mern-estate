import React from 'react'
import {Button} from "flowbite-react"
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import {AiFillGoogleCircle} from "react-icons/ai"
import { useNavigate } from 'react-router-dom'
import apiRequest from '../utils/apiRequest'

const OAuth = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleGoogleClick = async()=>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth,provider)

            const res = await apiRequest.post("auth/google",{
                name:result.user.displayName,
                email:result.user.email,
                photo:result.user.photoURL
            })
            dispatch(signInSuccess(res.data))
            navigate("/")
            
        } catch (err) {
            console.log("could not sign in with google",err);
        }
    }
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>

  )
}

export default OAuth