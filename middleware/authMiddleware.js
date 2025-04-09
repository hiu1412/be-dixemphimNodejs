import jwt from "jsonwebtoken";
import client from "../config/redis.js";
import env from "../common/env.js";

const authMiddleware = async(req,res, next)=>{
    try{
        const authHeader = req.header('Authorization'); // Lấy header Authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("Không có token hoặc header Authorization không đúng định dạng");
            return res.status(401).json({ success: false, message: "Không có token hoặc header không hợp lệ" });
        }

        const token = authHeader.split(' ')[1]; // Tách token từ header
        if (!token) {
            console.log("Không có token trong header Authorization");
            return res.status(401).json({ success: false, message: "Không có token" });
        }



        const isBlacklisted = await client.get(`blacklist:${token}`);
        if(isBlacklisted) return res.status(401).json({success: false, message: "Token đã bị thu hồi"});

        const decoded = jwt.verify(token, env.JWT_SETTINGS.ACCESS_SECRET);
        req.user = decoded;
        next();
    }catch(error)
    {
        res.status(401).json({success: false, message: "Token không hợp lệ"});
    }
};


export default authMiddleware;