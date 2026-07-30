import transporter from "../config/mail.js";

const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"Product Management" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("✅ Email sent successfully");
    } catch (error) {
        console.log("❌ Email Error:", error.message);
    }
};

export default sendEmail;