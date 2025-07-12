import jwt from 'jsonwebtoken';
const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token || typeof token !== 'string') {
            return res.status(401).json({ message: "Unauthorized", error: "No token or token is not a string" });
        }
        let verifyToken;
        try {
            verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized", error: err.message });
        }
        req.userId = verifyToken.userId; // Attach user info to request object
        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error in isAuth", error: error.message });
    }
}

export default isAuth;