import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoChevronBack } from "react-icons/io5";


function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData} = useContext(userDataContext)
    const navigate = useNavigate();
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
    const [loading,setLoading] = useState(false)

    const handleUpdateAssistant = async () => {
        setLoading(true);
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);
            if (backendImage instanceof File) {
                formData.append("assistantImage", backendImage);
            } else if (typeof backendImage === 'string' && backendImage) {
                formData.append("imageUrl", backendImage);
            } else {
                formData.append("imageUrl", selectedImage);
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
                withCredentials: true});
                console.log(result.data);
            setUserData(result.data);
            setLoading(false);
            navigate("/"); 
        } catch (error) {
            setLoading(false); 
            console.error("Error updating assistant:", error);
            
        }
    }
    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-[black] 
        to-[#030353] flex justify-center items-center flex-col p-[30px] relative">
            <IoChevronBack className="absolute top-[30px] cursor-pointer left-[30px] text-white
            w-[25px] h-[25px]" onClick={()=>navigate("/customize")}/>
            <h1 className="text-white text-[30px] mb-[20px] text-center">Enter your 
                <span className="text-blue-400"> Assitant Name</span></h1>
                  <input type="text" placeholder="Eg: Modi Ji" className="w-full max-w-[600px]
                h-[60px] outline-none border-2 border-white bg-transparent
                text-white placeholder-gray-300 
                px-[20px] py-[10px] rounded-full text-[18px]" required onChange={(e)=>setAssistantName
                (e.target.value)} value={assistantName}
                />
                {assistantName && <button className="min-w-[260px] h-[50px] mt-[10px] 
            text-black font-semibold cursor-pointer bg-white rounded-full text-[18px] 
            shadow hover:bg-blue-100 transition-all"
            disabled={loading}
            onClick={()=>handleUpdateAssistant()}>{!loading?"Generate Your Assistant":"Loading..."}</button>}
        </div>
    )
}

export default Customize2;