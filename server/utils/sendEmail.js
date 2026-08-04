const sendEmail = async ({ to, subject, html }) => {
    try {
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: to }] }],
                from: { email: "hostelnamagement@gmail.com", name: "Product Management" },
                subject,
                content: [{ type: "text/html", value: html }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("❌ Email Error:", errorData);
            return;
        }

        console.log("✅ Email sent successfully");
    } catch (err) {
        console.error("❌ Email Error:", err.message);
    }
};

export default sendEmail;