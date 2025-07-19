import React, { useContext, useState } from "react";
import bg from "../assets/bg1.jpg"
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext.jsx";

function SignIn() {
    const [showPassword,setShowPassword] = useState(false)
    const {serverUrl,userData, setUserData} = useContext(userDataContext)
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [err,setErr] = useState("")


const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    
    try {
        let result = await axios.post(`${serverUrl}/api/auth/login`, {
            email,
            password
        }, { withCredentials: true });
        setUserData(result.data); // update context with user data after login
        setLoading(false);
        navigate("/"); // redirect to home after login
    } catch (error) {
        console.log(error);
        setLoading(false);
        setErr(error?.response?.data?.message || "Server is not responding.");
    }
};

    return (
        <div  className="w-full h-[100vh] bg-cover flex justify-center items-center"
        style={{backgroundImage:`url(${bg})`}}>
            <form className="w-[90%] h-[500px] max-w-[400px] bg-[#00000062]
            backdrop-blur shadow-lg shadow-black flex 
            flex-col items-center justify-center 
            gap-[20px] px-[20px]" onSubmit={handleSignIn}>

                <h1 className="text-[white] text-[30px] font-semibold
                mb-[30px]">SignIn to <span className="text-blue-400">Assitant</span></h1>

                

                <input type="email" placeholder="Email" className="w-full
                h-[60px] outline-none border-2 border-white bg-transparent
                text-white placeholder-gray-300 
                px-[20px] py-[10px] rounded-full text-[18px]" required 
                onChange={(e)=>setEmail(e.target.value)} value={email} />

               <div className="w-full h-[60px] border-2 border-white
               bg-transparent text-white rounded-full text-18px">
                <input type={showPassword?"text":"password"} placeholder="Password" className="w-full
                h-full rounded-full outline-none bg-transparent
                 placeholder-gray-300 
                px-[20px] py-[10px]" required 
                onChange={(e)=>setPassword(e.target.value)} value={password} />
               {!showPassword && <IoMdEye className="absolute top-[250px] right-[35px] w-[25px]
                h-[25px] text-[white] cursor-pointer" onClick={()=>setShowPassword(true)}/>}
                {showPassword && <IoMdEyeOff className="absolute top-[250px] right-[35px] w-[25px]
                h-[25px] text-[white]  cursor-pointer" onClick={()=>setShowPassword(false)}/>}
               
               </div>
               {err.length>0 && <p className="text-red-500">
                 *{err}
                </p>}

               <button className="min-w-[150px] h-[60px] mt-[25px]
               text-black font-semibold bg-white rounded-full text-[20px]"
               disabled={loading}>{loading ? "Loading...":"Sign In"}</button>
               <p className="text-white text-[18px] cursor-pointer" 
               onClick={()=>navigate("/signup")}>Create An Account?
                <span className="text-blue-400">  Sign Up</span>
               </p>
            </form>
            
        </div>
    )
}

export default SignIn