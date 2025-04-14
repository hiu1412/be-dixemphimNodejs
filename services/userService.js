import validator from 'validator';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';


//delete
const removeUser = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) throw new Error("Người dùng không tồn tại");
        return user;
    } catch (error) {
        throw new Error(`Lỗi khi xóa người dùng: ${error.message}`);
    }
};

// Đổi mật khẩu người dùng
const changeUserPassword = async (userId, currentPassword, newPassword) => {
    // Tìm user theo ID
    try {
        // Tìm user theo ID
        const user = await User.findOne(userId); // Giữ nguyên findById trước

        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        // Verify mật khẩu hiện tại
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error("Mật khẩu hiện tại không chính xác");
        }

        // Validate mật khẩu mới
        if (!newPassword || newPassword.length < 6) {
            throw new Error("Mật khẩu mới phải dài hơn 6 ký tự");
        }
        

        // Hash và lưu mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedNewPassword;
        user.updateAt = Date.now();
        await user.save();
    } catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        throw error;
    }
};


//list
const listUser = async () => {
    try {
        const users = await User.find({}, 'username email role active');
        return users;
    } catch (error) {
        throw new Error("Loi khi lay danh sach nguoi dung: " + error.message);
    }
}


//update
const updateUser = async (userId, editedName, editedEmail, editedRole, editedActive, editedPassword) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("người dùng không tồn tại");

    if (editedPassword && editedPassword.length >= 6) {
        user.username = editedName;
        user.email = editedEmail;
        user.role = editedRole;
        user.active = editedActive;
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(editedPassword, salt);
        user.password = hashedNewPassword;
        await user.save()
        return user;
    } else
        throw new Error("Mật khẩu chưa đủ ký tự",);

}


//getUserById
const getUserById = async (userId) => {
    try {
        // Tìm người dùng trong database
        const user = await User.findById(userId).select('-password'); // Không trả về mật khẩu
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }
        return user;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng từ database:", error.message);
        throw new Error("Lỗi khi lấy thông tin người dùng");
    }
};


export { removeUser, changeUserPassword, listUser, updateUser, getUserById };
