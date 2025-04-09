import multer from 'multer';

// Cấu hình Multer để lưu file vào bộ nhớ (buffer)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file (5MB)
});

export default upload;