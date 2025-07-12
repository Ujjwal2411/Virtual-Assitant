import React, { createContext } from "react";
import { useState } from "react";
export const userDataContext = createContext()
import axios from "axios";
import { useEffect } from "react";

function UserContext ({children}) {
    const serverUrl = "http://localhost:8000"
    const [userData,setUserData] = useState(null);

    // ...existing code...
    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, 
                {withCredentials: true})
            setUserData(result.data);
            console.log(result.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Handle unauthorized: maybe redirect to login or show a message
                setUserData(null);
                console.log("User not authenticated");
            } else {
                console.log(error)
            }
        }
    }
// ...existing code...
    useEffect(() => {
        handleCurrentUser()
    }, []);

    const value = {
         serverUrl,
        userData,
        setUserData,
    }
    return (
         <userDataContext.Provider value={value}>
            {children}
            </userDataContext.Provider>

    
    )
}

export default UserContext