import "dotenv/config";
import sendEmail from "./utils/sendEmail.js";

await sendEmail({
    to: "adityasinhbarad@gmail.com",
    subject: "Test Email",
    html: `
        <h2>Hello 👋</h2>
        <p>This is a test email from your Product Management project.</p>
    `,
});