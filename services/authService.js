import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import env from '../common/env.js';
import crypto from 'crypto';
import moment from 'moment';
import validator from 'validator';
import redisClient from '../config/redis.js';
import client from '../config/redis.js';

//dang ky
const registerUser = async (username, email, password) => {
    //check loi
    const exists = await User.findOne({ email });
    if (exists) throw new Error("Email đã tồn tại");

    if (!validator.isEmail(email)) throw new Error("Email không hợp lệ");

    if (password.lenght < 6) throw new Error("Mật khẩu phải dài hơn 6 kí tự");

    //băm
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create 
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: "user",
        isEmail: false,
        active: true
    });
    await newUser.save();
    return newUser;
};

//login user
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Tài khoản không tồn tại");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Sai mật khẩu");

    const { accessToken, refreshToken } = createToken(user._id, user.role, user.email, user.username);

    const sessionKey = `session:${user._id}:${crypto.randomUUID()}`;

    const sessionData = {
        user_id: user._id.toString(),
        refresh_token: refreshToken,
        is_revoked: "false",
        // device: userAgent, 
        // ip_address: ipAddress, 
        last_activity: Date.now(),
    };
    await client.hSet(sessionKey, sessionData);
    await client.expire(sessionKey, 60 * 60 * 24 * 30); 
    

    return { user, accessToken, refreshToken, sessionKey };
}

//refresh token
const refreshAuthToken = async (refreshToken) => {
    try {
        console.log("refreshToken", refreshToken);
        const decoded = jwt.verify(refreshToken, env.JWT_SETTINGS.REFRESH_SECRET);
        if (!decoded) throw new Error("Refresh token khong hop le");

        const sessionKeys = await client.keys(`session:${decoded.userId}:*`);
        const sessionKey = sessionKeys.find(async (key) => {
            const storedToken = await client.hGet(key, 'refreshToken');
            return storedToken === refreshToken;
        });
`       `
        if (!sessionKey) throw new Error("Phiên đăng nhập không hợp lệ");

        const { accessToken } = createToken(decoded.userId, decoded.role, decoded.email, decoded.username);
        return { accessToken };
    } catch (error) {
        throw new Error("Refresh token khong hop le");
    }
};

//tao token
const createToken = (userId, role, email, username) => {
    const accessToken = jwt.sign({ userId, role, email }, env.JWT_SETTINGS.ACCESS_SECRET, { expiresIn: env.JWT_SETTINGS.EXPIRES_IN });
    const refreshToken = jwt.sign({ userId, role, email }, env.JWT_SETTINGS.REFRESH_SECRET, { expiresIn: env.JWT_SETTINGS.REFRESH_EXPIRES_IN });
    return { accessToken, refreshToken, user: { userId, role, email, username } };
};

//ma hoa va giai ma mat khau
//ma hoa mat khau bang AES
const encryptAES = (secretKey, plaintext) => {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = Buffer.concat([iv, cipher.update(plaintext, 'utf8'), cipher.final()]);
    return encrypted.toString('base64url');
}

//giai ma mat khau bang AES
const decryptAES = (secretKey, encrypted) => {
    const algorithm = 'aes-256-cbc';
    const ivCiphertext = Buffer.from(encrypted, 'base64url');
    const iv = ivCiphertext.subarray(0, 16);
    const ciphertext = ivCiphertext.subarray(16);
    const cipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = Buffer.concat([cipher.update(ciphertext), cipher.final()]);
    return decrypted.toString('utf-8');
}

//tao token dat lai mat khau
const generateResetPasswordToken = async (reqEmail) => {
    const user = await User.findOne({ email: reqEmail });
    const result = {};

    if (!user) {
        result.success = false;
        result.message = "Email không tồn tại";
    }

    else {
        try {
            const secretKey = env.AUTH.PRIVATE_KEY;
            const expiresAt = moment().add(15, 'minutes').format("DDMMYYYYHHmmss");

            const payload = {
                email: reqEmail,
                expiresAt: expiresAt,
            };

            const encryptedToken = encryptAES(secretKey, JSON.stringify(payload));

            result.success = true;
            result.message = "Tạo token thành công";
            result.token = encryptedToken;
        } catch (error) {
            result.success = false;
            result.message = "Lỗi! Không thể thực hiện tạo token";
        }
    }
    return result;
}

const verifyResetPasswordToken = (token) => {
    try {
        const data = JSON.parse(decryptAES(env.AUTH.PRIVATE_KEY, token));
        const now = moment().format("DDMMYYYYHHmmss");
        return now < data.expiresAt;
    } catch (error) {
        return false;
    }
}

const resetPassword = async (token, newPassword) => {
    const result = {};

    if (verifyResetPasswordToken(token)) {
        // Kiểm tra độ dài mật khẩu
        console.log('newPassword:', newPassword);
        console.log('typeof newPassword:', typeof newPassword);

        if (!newPassword || typeof newPassword !== 'string') {
            return {
                success: false,
                message: "Mật khẩu không hợp lệ.",
            };
        }
        if (newPassword.length < 6) {
            result.success = false;
            result.message = "Mật khẩu phải dài hơn 6 ký tự";
        }
        else {
            const data = JSON.parse(decryptAES(env.AUTH.PRIVATE_KEY, token));

            // Băm mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await User.findOneAndUpdate({ email: data.email }, { password: hashedPassword });
            result.success = true;
            result.message = "Cập nhật mật khẩu mới thành công";
        }
    } else {
        result.success = false;
        result.message = "Token không hợp lệ hoặc đã hết hạn";
    }
    return result;
}

const authenticateEmail = async (email, emailVerificationCode) => {
    const user = await User.findOne({ email: email });
    const result = {}

    if (!user) {
        throw new UserNotFoundError("Người dùng không tồn tại");
    }

    if (user.isEmail) {
        result.success = false;
        result.message = "Email đã được kích hoạt";
    }
    else if (user.emailVerificationCode === emailVerificationCode) {
        await User.findOneAndUpdate({ email: email }, { isEmail: true });

        result.success = true;
        result.message = "Xác thực email thành công";
    } else {
        result.success = false;
        result.message = "Mã xác thực không khớp"
    }
    return result;
}


const logoutUser = async (sessionKey, accessToken) => {
    await client.del(sessionKey);

    const blacklistKey = `blacklist:${accessToken}`;
    await client.set(blacklistKey, 'true', {EX: 60 * 60 * 24});

    return true;
};


export {registerUser, loginUser, refreshAuthToken, createToken, encryptAES, decryptAES, generateResetPasswordToken, verifyResetPasswordToken, resetPassword, authenticateEmail, logoutUser };