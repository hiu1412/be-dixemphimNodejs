import { createScreen, getAllScreens, getScreen, updateScreen, deleteScreen } from '../services/screenService.js';

// Tạo một screen mới
const create = async (req, res) => {
    try {
        const screen = await createScreen(req.body);
        res.status(201).json({ success: true, screen, message: "Tạo phòng chiếu thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách tất cả các screen
const list = async (req, res) => {
    try {
        const screens = await getAllScreens();
        res.status(200).json({ success: true, screens });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy thông tin screen theo ID
const getById = async (req, res) => {
    try {
        const screen = await getScreen(req.params.id);
        if (!screen) return res.status(404).json({ success: false, message: "Phòng chiếu không tồn tại" });
        res.status(200).json({ success: true, screen });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật screen theo ID
const update = async (req, res) => {
    try {
        const screen = await updateScreen(req.params.id, req.body);
        if (!screen) return res.status(404).json({ success: false, message: "Phòng chiếu không tồn tại" });
        res.status(200).json({ success: true, screen, message: "Cập nhật phòng chiếu thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa screen theo ID
const remove = async (req, res) => {
    try {
        const screen = await deleteScreen(req.params.id);
        if (!screen) return res.status(404).json({ success: false, message: "Phòng chiếu không tồn tại" });
        res.status(200).json({ success: true, message: "Xóa phòng chiếu thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { create, list, getById, update, remove };