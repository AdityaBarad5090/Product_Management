import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOrderEmail = async (userEmail, orderDetails) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",  // use this for testing; verify your own domain later for production
            to: userEmail,
            subject: "Order Confirmed",
            html: `<p>Your order has been placed successfully!</p>`,
        });

        if (error) {
            console.error("❌ Email Error:", error);
            return;
        }

        console.log("✅ Email sent:", data);
    } catch (err) {
        console.error("❌ Email Error:", err);
    }
};