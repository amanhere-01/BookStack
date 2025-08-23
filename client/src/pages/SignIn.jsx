import React, { useRef } from "react";
import background from "../assets/images/background.jpeg";
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { toast } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_URL;

function SignIn() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async(e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try{
      const res = await fetch(`${BASE_URL}/user/signin`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({email, password}),
      })

      const data = await res.json();
      const user = data.user;
      
      if (res.ok) {
        dispatch(setUser(user));
        navigate('/')
      } 
      else {
        toast.error(data.error);
      }

    } catch(err){
      console.error("Error during login:", err);
      toast.error("Something went wrong.");
    }
  }

  return (
    <div className="h-full w-full flex flex-col md:flex-row font-sans overflow-hidden">
      <div className="w-full">
        <img
          src={background}
          alt="Background theme"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full flex items-center justify-center bg-red-50 px-4">
        <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <h2 className="text-gray-800 text-2xl font-bold mb-6 text-center">
            Log In to your account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
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
              Log In
            </button>
          </form>

          <p className="mt-4 text-sm text-black/70 text-center">
            Don't have an account?{" "}
            <Link to="/user/signup" className="text-blue-400 hover:underline cursor-pointer">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
