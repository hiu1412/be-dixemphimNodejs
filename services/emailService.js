import User from "../models/user.js";
import env from "../common/env.js";
import nodemailer from "nodemailer";


//tao ma xac minh
const generateVerificationCode = async (email) => {
    const user = await User.find({ email: email });

    if (!user) {
        throw new UserNotFoundError("Người dùng không tồn tại");
    }

    const min = 100000;
    const max = 999999;

    const verificationCode = Math.floor(Math.random() * (max - min)) + min;

    await User.findOneAndUpdate({ email: email }, {
        emailVerificationCode: verificationCode
    })

    return verificationCode;
}

//gui mail xac minh

const sendEmail = async ({ from, to, subject, plaintext = "", html = "" }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: env.SMTP_SETTINGS_USER,
            pass: env.SMTP_SETTINGS_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: plaintext,
        html: html,
    });
}
export { generateVerificationCode, sendEmail }
