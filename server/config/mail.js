import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,        // STARTTLS instead of direct SSL
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    family: 4,
    connectionTimeout: 15000,   // give it more time before giving up
    greetingTimeout: 15000,
});

export default transporter;