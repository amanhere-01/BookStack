import React, { useRef, useState } from 'react'
import background from "../assets/images/background.jpeg";
import avatar from '../assets/images/avatar.png'
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_URL;


function SignUp() {
  const[previewImage, setPreviewImage] = useState(avatar);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();


  const handleImageClick = (e) => {
    fileInputRef.current.click();
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', nameRef.current.value);
    formData.append('email', emailRef.current.value);
    formData.append('password', passwordRef.current.value);
    formData.append('profileImage', profileImage);

    // console.log(nameRef.current.value ,emailRef.current.value,passwordRef.current.value,profileImg)

    try{
      const res = await fetch(`${BASE_URL}/user/signup`, {
        method: "POST",
        body: formData
      })

      const data = await res.json();
      if (res.ok) {
        toast.info(data.message); 
      } else {
        toast.error(data.error || "Signup failed.");
      }
    } catch(err){
        console.error(err);
        toast.error("An error occurred while signing up.");
    }
  }


  return (
      <div className="h-full w-full flex flex-col md:flex-row font-sans overflow-hidden">
        {/*Left Side */}
        <div className='w-full'>
          <img
            src={background}
            alt="Background theme"
            className="w-full h-full object-cover"
          />
        </div>

        {/*Right Side */}
        <div className="w-full flex items-center justify-center bg-red-50 px-4">
          <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
            <h2 className="text-gray-800 text-2xl font-bold mb-6 text-center">
              Create a new account
            </h2>
  
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              <div className="flex flex-col items-center ">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mb-2 w-20 h-20 object-center rounded-full border border-black/30 cursor-pointer hover:opacity-80 transition"
                  onClick={handleImageClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label className="text-black/30 text-xs">Click to change</label>
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  ref={nameRef}
                  required
                  className="p-3 rounded-lg bg-black/20 text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-blue-400"

                />
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  ref={emailRef}
                  required
                  className="p-3 rounded-lg bg-black/20 text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
  
              <div className="flex flex-col">
                <label className="text-black mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  ref={passwordRef}
                  required
                  className="p-3 rounded-lg bg-black/20 text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
  
              <button
                type="submit"
                className="bg-black/20 text-gray-800 hover:bg-gray-800 hover:text-white font-semibold py-3 rounded-lg transition duration-300 cursor-pointer"
              >
                Create Account
              </button>
            </form>
  
            <p className="mt-4 text-sm text-black/70 text-center">
              Already have an account?{" "}
              <span onClick={() => navigate('/user/signin')} className="text-blue-400 hover:underline cursor-pointer">Sign in</span>
            </p>
          </div>
        </div>
      </div>
    );
}

export default SignUp
