import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../env.js';

export const generateEncryptedPassword=async(password)=>{
    return await bcrypt.hash(password,env.SALT_ROUND)
}

export const validateThePassword= async (enteredPassword,savedPassword) => {
    return await bcrypt.compare(enteredPassword, savedPassword)
};

export const generateAccessToken = function (user) {
    return jwt.sign(
        {
            unique_id: user.id,
            role: user.role,
            is_active:user.is_active,
            iat: Date.now() / 1000
        },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: env.ACCESS_TOKEN_TTL }
    );
};

export const generateRefreshToken = function (user) {
    return jwt.sign(
        {
            user_id: user.id,
        },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: env.REFRESH_TOKEN_TTL }
    );
};
export const generateAccessAndRefreshTokens = async (user) => {

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return { accessToken, refreshToken };
    
};

export const generatePasswordResetToken = (email) => {
    return jwt.sign({email: email},env.PASSWORD_RESET_SECRET,{expiresIn:env.RESET_TOKEN_TTL});
}

export const decodeAccessToken = (accessToken) => {
    return jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
}

export const decodeRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
}

export const decodeResetToken = (resetToken) => {
    return jwt.verify(resetToken,env.PASSWORD_RESET_SECRET)
}