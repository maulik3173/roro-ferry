import jwt from "jsonwebtoken";
import secretKey from "../configuration/jwtConfig.js";


export function genreateToken(user){
    const paylaod = {
        id:user._id,
        email:user.email,
        role:user.role
    };
   return jwt.sign(paylaod,secretKey,{expiresIn: '7d'});
};

export function genreateRefreshToken(user){
    const paylaod = {
        id:user._id,
        email:user.email,
        role:user.role
    };
    return jwt.sign(paylaod,secretKey,{expiresIn: '7d'});
};

export function verifyToken(token){
    return jwt.verify(token,secretKey);
};

