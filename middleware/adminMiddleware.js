const adminMiddle = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Khong co quyen truy cap"
        });
    }
    next();
}

export default adminMiddle;
//user._id, user.role, user.email, user.username