import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userImg from "../assets/user.gif";
import aiImg from "../assets/ai.gif";
import { BiMenuAltRight } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

function Home() {
    const {userData,setUserData,serverUrl,getGeminiResponse} = useContext(userDataContext);
    const navigate = useNavigate();
    const [listening, setListening] = useState(false);
    const [userText,setUserText] = useState("");
    const [aiText,setAiText] = useState("");
    const [ham,setHam] = useState(false);
    const isSpeakingRef = useRef(false);
    const isRecognizingRef = useRef(false);
    const recognitionref = useRef(null);
    const synth = window.speechSynthesis;
    
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

    const handleCommand = (data) => {
      
        
        const { response, type, userInput } = data;
        speak(response || "Sorry, I couldn't get a response. Please try again.");

        if (type === 'google-search') {
            const query = encodeURIComponent(userInput);
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
        }

        if (type === 'youtube-search' || type === 'youtube-play') {
            const query = encodeURIComponent(userInput);
            window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
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
            const query = encodeURIComponent(userInput);
            window.open(`https://www.weather.com/weather/today/l/${query}`, '_blank');
        }
    }


    const startRecognition = () => {
        if (!isSpeakingRef.current || !isRecognizingRef.current) 
       { try {
            recognitionref.current?.start();
            console.log("Voice recognition requested to start");
        } catch (error) {
            if (error.name !== "NotAllowedError") {
                console.error("Voice recognition not allowed:", error);
            }
            
        }}
    }
    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "hn-IN";
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(v => v.lang === 'hi-IN');
        if (hindiVoice) {
            utterance.voice = hindiVoice;
        }
        isSpeakingRef.current = true;
        utterance.onend = () => {
            setAiText("");
            isSpeakingRef.current = false;
            setTimeout(() => {
            startRecognition()
        },800)
        }   
        synth.cancel()
        synth.speak(utterance); 
    }

        useEffect(()=>{
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous= true;
            recognition.lang = "en-US";
            recognition.interimResults = false;

            recognitionref.current = recognition;

            let isMounted = true;

            const startTimeOut = setTimeout(() => {
                if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
                    try {
                        recognition.start();
                        console.log("Voice recognition started");
                    } catch (error) {
                        if (error.name !== 'NotAllowedError') {
                            console.error("Voice recognition not allowed:", error);
                        }
                        
                    }
                }
            },1000)


        // const safeRecognition = () => {
        //     if (!isSpeakingRef.current && !isRecognizingRef.current){
        //         try {
        //             recognition.start();
        //             console.log("Voice recognition started");
        //         } catch (error) {
        //             if (error.name !== 'NotAllowedError') {
        //                 console.error("Voice recognition not allowed:", error);
        //             }
        //         }
        //     }
        // }

        recognition.onstart = () => {
            console.log("Voice recognition started");
            isRecognizingRef.current = true;
            setListening(true);
        }

        recognition.onend = () => {
            console.log("Voice recognition ended");
            isRecognizingRef.current = false;
            setListening(false);
            if(isMounted && !isSpeakingRef.current) {
                setTimeout(() => {
                    if (isMounted){
                        try {
                            recognition.start();
                            console.log("Voice recognition restarted");
                        } catch (error) {
                            if (error.name !== 'NotAllowedError') {
                                console.error("Voice recognition not allowed:", error);
                            }
                            
                        }
                    }

                },1000)
            }
        }

        recognition.onerror = (event) => {
            console.warn("Voice recognition error:", event.error);
            isRecognizingRef.current = false;
            setListening(false);
            if (event.error !== "abort" && isMounted && !isSpeakingRef.current) {
                setTimeout(()=>{
                    if (isMounted){
                        try {
                            recognition.start();
                            console.log("Voice recognition restarted after error");
                        } catch (error) {
                            if (error.name !== 'NotAllowedError') {
                                console.error("Voice recognition not allowed:", error);
                            }
                            
                        }
                    }
                },1000)
            }
                
        }



            recognition.onresult = async (e) => {
                const transcript = e.results[e.results.length - 1][0].transcript.trim() ;
                console.log("heard:" + transcript);

                if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
                    setAiText("");
                    setUserText(transcript);
                    recognition.stop();
                    isRecognizingRef.current = false;
                    setListening(false);
                    try {
                        const data = await getGeminiResponse({ transcript }); // send as object for POST body

                        
                        handleCommand(data);
                        setAiText(data.response);
                        setUserText("");
                    } catch (err) {
                        console.error("Error in Gemini response:", err);
                    }
                }
            }

            // const fallback = setInterval(() => {
            //     if (!isSpeakingRef.current && !isRecognizingRef.current){
            //         safeRecognition();
            //     }
            // },10000)
            // safeRecognition()

            const greeting =new SpeechSynthesisUtterance(`Hello 
                ${userData.name}, I am your virtual assistant. How can I help you today?`);
                greeting.lang = "hi-IN";

                window.speechSynthesis.speak(greeting);

            return () => {
                isMounted = false;
                clearTimeout(startTimeOut);
                recognition.stop();
                setListening(false);
                isRecognizingRef.current = false;
            }


          
        },[])

        
    
    return (
        <div  className="w-full h-[100vh] bg-gradient-to-t from-[black] 
        to-[#030353] flex justify-center items-center flex-col gap-[10px] p-[20px] overflow-hidden"> 
        <BiMenuAltRight className="lg:hidden text-white absolute top-[20px] right-[20px] w-[45px] h-[45px]"
        onClick={()=>setHam(true)}/>
        <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col
        items-start  gap-[20px] ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
            <RxCross2 className="text-white absolute top-[20px] right-[40px] w-[45px] h-[45px]" onClick={()=>setHam(false)}/>

            <button className="min-w-[150px] h-[60px] mt-[25px]
               text-black font-semibold bg-white cursor-pointer  rounded-full text-[20px]  top-[20px] right-[20px] "
               onClick={handleLogOut}>Log Out</button>
            <button className="min-w-[150px] h-[60px] 
               text-black font-semibold   cursor-pointer  top-[100px] right-[20px]  bg-white rounded-full text-[20px]
               px-[20px] py-[10px] " onClick={()=> navigate("/customize")}> Customize Your Assitant
               </button>

               <div className="w-full h-[2px] bg-gray-400"></div>
               <h1 className="text-white font-semibold text-[19px]"> History</h1>
               <div className="w-full h-[60%] overflow-auto flex flex-col gap-[20px]">
                {
                    // userData.history?.map((his) => (
                    //     <span className="text-grey text-[18px] truncate">{his}</span>
                    // ))
                }
               </div>
        </div>
        
        <button className="min-w-[150px] h-[60px] 
               text-black font-semibold bg-white cursor-pointer hidden lg:block rounded-full text-[20px] absolute top-[20px] right-[20px] "
               onClick={handleLogOut}>Log Out</button>
        <button className="min-w-[150px] h-[60px] 
               text-black font-semibold absolute  cursor-pointer hidden lg:block top-[100px] right-[20px]  bg-white rounded-full text-[20px]
               px-[20px] py-[10px] " onClick={()=> navigate("/customize")}> Customize Your Assitant
               </button>
        <div className="w-[250px] h-[350px] flex justify-center items-center 
        overflow-hidden rounded-4xl shadow-lg">
            <img src={userData?.assistantImage} alt="" className="h-full object-cover"/>

        </div>
        <h1 className="text-white text-[18px] font-semibold ">Hello I am {userData?.assistantName}</h1>
        {!aiText && <img src={userImg} alt="" className="w-[200px]"/>}
        {aiText && <img src={aiImg} alt="" className="w-[200px]"/>}

        <h1 className="text-white text-[18px] font-bold text-wrap">{userText?userText:aiText?aiText:null}</h1>
            
        </div>
    );
}

export default Home;