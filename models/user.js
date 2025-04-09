import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    active: { type: Boolean, required: false, default: true },
    emailVerificationCode: { type: String, required: false, default: null },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
})

const User = mongoose.model("User", userSchema);
export default User;