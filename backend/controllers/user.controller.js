import User from '../models/user.model.js';
import uploadOnCloudinary from '../config/cloudinary.js';
import geminiResponse from '../gemini.js';
import moment from "moment"
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId; 
        const user = await User.findById(userId).select('-password'); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user", error: error.message });
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage;
        if (req.file) {
            try {
                assistantImage = await uploadOnCloudinary(req.file.path);
            } catch (cloudErr) {
                console.error("Cloudinary upload error:", cloudErr);
                return res.status(500).json({ message: "Cloudinary upload failed", error: cloudErr.message });
            }
        } else {
            if (!imageUrl) {
                console.error("No file uploaded and no imageUrl provided.");
                return res.status(400).json({ message: "No image provided" });
            }
            assistantImage = imageUrl;
        }

        const userId = req.userId;
        try {
            const user = await User.findByIdAndUpdate(userId, {
                assistantName,
                assistantImage
            }, { new: true }).select('-password');
            return res.status(200).json(user);
        } catch (dbErr) {
            console.error("MongoDB update error:", dbErr);
            return res.status(500).json({ message: "Database update failed", error: dbErr.message });
        }
    } catch (error) {
        console.error("General error in updateAssistant:", error);
        return res.status(500).json({ message: "Error updating assistant", error: error.message });
    }
}


export const askToAssistant = async (req, res) => {
    try {
        const {transcript} = req.body;
        const user = await User.findById(req.userId);
        user.history.push(transcript);
        user.save();
        const userName = user.name
        const assistantName = user.assistantName 
        const result = await geminiResponse(transcript,assistantName,userName)

        const jsonMatch = result.match(/{[\s\S]*}/)
        if (!jsonMatch) {
            return res.status(400).json({ message: "Invalid response format from Gemini" });
        }

        const gemResult = JSON.parse(jsonMatch[0])
        const type = gemResult.type;

        switch (type) {
            case "get-date" :
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: ` current date is ${moment().format('YYYY-MM-DD')}`
                })
            case "get-time":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: ` current time is ${moment().format('hh:mm A')}`
                });

            case "get-day":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${moment().format('dddd')}`
                });

            case "get-month":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current month is ${moment().format('MMMM')}`
                });
            
            case 'google-search':
            case 'youtube-search':
            case 'youtube-play':
            case 'calculator-open':
            case 'instagram-open':
            case 'general':
            case 'facebook-open':
            case 'weather-show':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response,
                });

            default:
                return res.status(400).json({ message: "I did not Understand this command" });
        }
                
            

    } catch (error) {
        return res.status(500).json({ message: "ask assitant error", error: error.message });
    }
}
