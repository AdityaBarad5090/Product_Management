import transporter from "../config/mail.js";

const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Product Management" <hostelnamagement@gmail.com>`,
            to,
            subject,
            html,
        });
        console.log("✅ Email sent:", info.messageId);
    } catch (err) {
        console.error("❌ Email Error:", err.message);
    }
};

export default sendEmail;