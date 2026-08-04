import apiInstance from "../config/mail.js";
import * as brevo from "@getbrevo/brevo";

const sendEmail = async ({ to, subject, html }) => {
    try {
        const email = new brevo.SendSmtpEmail();
        email.sender = { email: "hostelnamagement@gmail.com", name: "Product Management" };
        email.to = [{ email: to }];
        email.subject = subject;
        email.htmlContent = html;

        const response = await apiInstance.sendTransacEmail(email);
        console.log("✅ Email sent:", response.body);
    } catch (err) {
        console.error("❌ Email Error:", err.message);
    }
};

export default sendEmail;