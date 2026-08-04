import resend from "../config/mail.js";

const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",  // switch to your verified domain later
            to,
            subject,
            html,
        });

        if (error) {
            console.error("❌ Email Error:", error);
            return;
        }

        console.log("✅ Email sent:", data);
    } catch (err) {
        console.error("❌ Email Error:", err.message);
    }
};

export default sendEmail;