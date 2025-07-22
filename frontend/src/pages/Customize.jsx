import React, { useContext, useRef, useState } from "react";
import Card from "../components/Card";
import image1 from "../assets/image1.jpg"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/image3.jpg"
import image4 from "../assets/image4.jpg"
import image5 from "../assets/image5.jpg"
import image6 from "../assets/image6.jpg"
import image7 from "../assets/image7.jpg"
import { LuImagePlus } from "react-icons/lu";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

function Customize() {
    const {serverUrl,
        userData,
        setUserData,frontendImage,
        setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage} = 
        useContext(userDataContext);
    const inputImage = useRef(null);
    const navigate = useNavigate()

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file)); 
    }
    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-[black] 
        to-[#030353] flex justify-center items-center flex-col p-[30px] ">
             <IoChevronBack className="absolute top-[30px] left-[30px] w-[25px] h-[25px] cursor-pointer text-white" onClick={() => navigate("/")} />
            <h1 className="text-white text-[30px] mb-[20px] text-center">Select Your <span className="text-blue-400">Assistant</span></h1>
            <div className="w-full max-w-[800px] flex justify-center items-center flex-wrap gap-[12px] mb-[20px]">
                <Card image={image1}/>
                <Card image={image2}/>
                <Card image={image3}/>
                <Card image={image4}/>
                <Card image={image5}/>
                <Card image={image6}/>
                <Card image={image7}/>
                <div className={`w-[80px] h-[160px] lg:w-[125px] lg:h-[225px] 
                bg-[#030326] border-2 border-[#0000ff66] rounded-2xl 
                overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer 
                hover:border-4 hover:border-white flex justify-center items-center
                ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950" 
        :null}`}
                onClick={() => {
                    inputImage.current.click()
                    setSelectedImage("input")
                    
                    }}>
                    {!frontendImage && <LuImagePlus className="text-white w-[30px] h-[30px]"/>}
                    {frontendImage && <img src={frontendImage} className="h-full object-cover" />}
                </div>
                <input type="file" accept="image/*" ref={inputImage} hidden 
                onChange={handleImage}/>
            </div>
            {selectedImage && <button className="min-w-[150px] h-[50px] mt-[10px] 
            text-black font-semibold cursor-pointer bg-white rounded-full text-[18px] 
            shadow hover:bg-blue-100 transition-all"
            onClick={()=>navigate("/customize2")}>Next</button>}
        </div>
    );

}

export default Customize