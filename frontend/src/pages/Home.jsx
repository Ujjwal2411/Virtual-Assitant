import React, { useContext, useEffect } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
    const {userData,setUserData,serverUrl,getGeminiResponse} = useContext(userDataContext);
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/logout`, 
                { withCredentials: true })
                setUserData(null);
                navigate("/signin"); 
        } catch (error) {
            setUserData(null)
            console.error("Logout failed:", error);
            
            
        }
    }

    const handleCommand = (data)=>{
        speak(response);

        if (type=== 'google-search') {
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
        }

        if (type === 'youtube-search') {
            window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
        }
        if (type === 'youtube-play') {
            window.open(`https://www.youtube.com/watch?v=${query}`, '_blank');
        }
        if (type === 'calculator-open') {
            window.open('https://www.calculator.com', '_blank');
        }

        if (type === 'instagram-open') {
            window.open('https://www.instagram.com', '_blank');
        }

        if (type === 'facebook-open') {
            window.open('https://www.facebook.com', '_blank');
        }
        if (type === 'weather-show') {
            window.open(`https://www.weather.com/weather/today/l/${query}`, '_blank');
        }

    }

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance); 
    }

        useEffect(()=>{
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous= true;
            recognition.lang = "en-US";


            recognition.onresult = async (e) => {
                const transcript = e.results[e.results.length - 1][0].transcript.trim() ;
                console.log("heard:" + transcript);

                if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
                    try {
                        const data = await getGeminiResponse({ transcript }); // send as object for POST body
                        console.log("Gemini response:", data);
                        speak(data.response);
                    } catch (err) {
                        console.error("Error in Gemini response:", err);
                    }
                }
            }


            recognition.start();
        },[])

        
    
    return (
        <div  className="w-full h-[100vh] bg-gradient-to-t from-[black] 
        to-[#030353] flex justify-center items-center flex-col gap-[15px]"> 
        <button className="min-w-[150px] h-[60px] mt-[25px]
               text-black font-semibold bg-white cursor-pointer rounded-full text-[20px] absolute top-[20px] right-[20px] "
               onClick={handleLogOut}>Log Out</button>
        <button className="min-w-[150px] h-[60px] mt-[25px]
               text-black font-semibold absolute  cursor-pointer top-[100px] right-[20px]  bg-white rounded-full text-[20px]
               px-[20px] py-[10px] " onClick={()=> navigate("/customize")}> Customize Your Assitant
               </button>
        <div className="w-[250px] h-[350px] flex justify-center items-center 
        overflow-hidden rounded-4xl shadow-lg">
            <img src={userData?.assistantImage} alt="" className="h-full object-cover"/>

        </div>
        <h1 className="text-white text-[18px] font-semibold ">Hello I am {userData?.assistantName}</h1>
            
        </div>
    );
}

export default Home;