import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_KEY,
    },
    family: 4,                  // ← force IPv4, same fix as before
    connectionTimeout: 20000,   // give it more time
    greetingTimeout: 20000,
    socketTimeout: 20000,
});

export default transporter;