import User from '../models/user.model.js';
import uploadOnCloudinary from '../config/cloudinary.js';
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
