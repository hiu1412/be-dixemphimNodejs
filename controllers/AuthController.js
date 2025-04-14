import { removeUser, changeUserPassword, listUser, updateUser, getUserById} from '../services/userService.js';
import { registerUser, loginUser, refreshAuthToken, verifyResetPasswordToken, resetPassword, authenticateEmail, logoutUser } from '../services/authService.js';
import client from '../config/redis.js';

//dang ky
const register = async (req, res) => {
    const { username, password, email, role } = req.body;
    try {
        const user = await registerUser(username, email, password, role);
        res.json({ success: true, user, message: "Đăng ký thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { user, accessToken, refreshToken, sessionKey } = await loginUser(email, password);

        // Set the session_id cookie
        res.cookie("session_id", sessionKey, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 60 * 60 * 24 * 30 * 1000, // Cookie expiration (30 days)
        });
        const data = { status: "success",
        message: "Đăng nhập thành công",
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        },}
        console.log(data);
        // Trả về phản hồi theo cấu trúc AuthResponse
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Đăng nhập không thành công",
            data: null,
        });
    }
};

//cap lai refresh token
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const { accessToken, refreshToken: newRefreshToken, user } = await refreshAuthToken(refreshToken);
        res.json({ success: true, accessToken, newRefreshToken, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



//đổi pass
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body; // Fix typo
    try {
        console.log(req.user);
        const result = await changeUserPassword(req.user.id, currentPassword, newPassword);
        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message }); // Trả về error message cụ thể
    }
};

//kiem tra token hop le hay khong
const verifyPasswordToken = (req, res) => {
    const { passwordToken } = req.params;
    return res.status(200).json({ isValid: verifyResetPasswordToken(passwordToken) })
}

//reset pass bang token
const resetUserPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const result = await resetPassword(token, newPassword);
    return res.status(200).json(result);
}



//xac thuc emailemail
const authenticateEmailCode = async (req, res) => {
    const { email, verificationCode } = req.query;

    try {
        const result = await authenticateEmail(email, verificationCode);
        return res.status(200).json(result);
    } catch (error) {
        if (createError.isHttpError(error) && error.status === 404) {
            return res.status(error.status).json({
                success: false,
                message: error.message
            });
        } else {
            console.error("Lỗi khi xác thực email:", error);
            return res.status(500).json({ // 500 Internal Server Error
                success: false,
                message: "Lỗi khi xác thực email",
            });
        }
    }
};


//list users
const list = async (req, res) => {
    try {
        const users = await listUser();
        return res.status(200).json({ success: true, users });
    } catch {
        return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách người dùng" });
    }
}


const getUser = async (req, res) => {
    try {
        // Kiểm tra req.user
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                status: "error",
                message: "Người dùng chưa được xác thực",
                data: null,
            });
        }

        // Lấy userId từ middleware (req.user)
        const userId = req.user.userId;

        // Gọi service để lấy thông tin người dùng từ database
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Người dùng không tồn tại",
                data: null,
            });
        }

        // Trả về thông tin người dùng
        return res.status(200).json({
            status: "success",
            message: "Lấy thông tin người dùng thành công",
            data: { user },
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error.message);
        return res.status(500).json({
            status: "error",
            message: "Lỗi khi lấy thông tin người dùng",
            data: null,
        });
    }
};

// Xóa người dùng
const remove = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ success: false, message: "Thiếu userId" });
    }
    try {
        const user = await removeUser(userId);
        res.json({ success: true, user, message: "Xóa người dùng thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Xóa người dùng thất bại", error: error.message });
    }
};

//update 
const update = async (req, res) => {
    const { userId } = req.params;

    const { email, password, username, role, active } = req.body;
    try {
        const user = await updateUser(userId, username, email, role, active, password);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//đăng xuất
const logout = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Không có token" });
    }

    const sessionKey = req.cookies?.session_id; // Assuming sessionKey is stored in cookies
    if (!sessionKey) {
        return res.status(400).json({ success: false, message: "Không tìm thấy sessionKey" });
    }

    try {
        await logoutUser(sessionKey, token); // Use the centralized logout logic
        return res.status(200).json({ success: true, message: "Đăng xuất thành công" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ success: false, message: "Lỗi khi đăng xuất" });
    }
};



export { register, remove, login, logout, refreshToken, changePassword, verifyPasswordToken, resetUserPassword, authenticateEmailCode, list, update, getUser };