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
  
      // Set the session_id cookie (vẫn giữ nguyên)
      res.cookie("session_id", sessionKey, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 60 * 60 * 24 * 30 * 1000, // Cookie expiration (30 days)
      });
  
      // Trả về phản hồi theo cấu trúc AuthResponse mong đợi ở frontend
      return res.json({
        status: "success",
        message: "Đăng nhập thành công",
        data: {
          user: { email: user.email, username: user.username },
          accessToken: accessToken,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Đăng nhập không thành công",
        error: error.message,
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
    const { currentPassword, newPassword } = res.body;
    try {
        const result = await changeUserPassword(req.user.id, currentPassword, newPassword);
        res.json({ success: true, message: "đổi pass thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi rồi" });
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

//user id
const getUser = async (req, res) => {
    try {
        const user = await getUserById(req.params.userId); 
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi khi lấy thông tin người dùng", error: error.message });
    }
}

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