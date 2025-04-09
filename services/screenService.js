import Screen from '../models/screen.js';

// Tạo một screen mới
const createScreen = async (data) => {
    try {
        const screen = new Screen(data);
        return await screen.save();
    } catch (error) {
        throw new Error("Lỗi khi tạo phòng chiếu: " + error.message);
    }
};

// Lấy danh sách tất cả các screen
const getAllScreens = async () => {
    try {
        return await Screen.find();
    } catch (error) {
        throw new Error("Lỗi khi lấy danh sách phòng chiếu: " + error.message);
    }
};

// Lấy thông tin screen theo ID
const getScreen = async (id) => {
    try {
        const screen = await Screen.findById(id);
        if (!screen) throw new Error("Phòng chiếu không tồn tại");
        return screen;
    } catch (error) {
        throw new Error("Lỗi khi lấy thông tin phòng chiếu: " + error.message);
    }
};

// Cập nhật screen theo ID
const updateScreen = async (id, data) => {
    try {
        const screen = await Screen.findByIdAndUpdate(id, data, { new: true });
        if (!screen) throw new Error("Phòng chiếu không tồn tại");
        return screen;
    } catch (error) {
        throw new Error("Lỗi khi cập nhật phòng chiếu: " + error.message);
    }
};

// Xóa screen theo ID
const deleteScreen = async (id) => {
    try {
        const screen = await Screen.findByIdAndDelete(id);
        if (!screen) throw new Error("Phòng chiếu không tồn tại");
        return screen;
    } catch (error) {
        throw new Error("Lỗi khi xóa phòng chiếu: " + error.message);
    }
};

export { createScreen, getAllScreens, getScreen, updateScreen, deleteScreen };