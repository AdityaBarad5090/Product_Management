const orderConfirmedTemplate = (order) => {
    return `
    <div style="
        max-width:600px;
        margin:20px auto;
        font-family:Arial,sans-serif;
        background:#fff;
        border:1px solid #ddd;
        border-radius:10px;
        overflow:hidden;
    ">

        <!-- Header -->
        <div style="
            background:#2563eb;
            color:#fff;
            text-align:center;
            padding:20px;
        ">
            <h1 style="margin:0;">🛍 Product Management</h1>
            <p style="margin:5px 0 0;">Order Confirmation</p>
        </div>

        <!-- Body -->
        <div style="padding:25px;">

            <h2 style="margin-top:0;">
                Hello, ${order.name} 👋
            </h2>

            <p>
                Your order has been
                <strong style="color:green;">Confirmed ✅</strong>.
            </p>

            <table style="
                width:100%;
                border-collapse:collapse;
                margin-top:20px;
            ">

                <tr>
                    <td style="padding:10px;border-bottom:1px solid #eee;">
                        <strong>📦 Product</strong>
                    </td>
                    <td style="padding:10px;border-bottom:1px solid #eee;">
                        ${order.product_name}
                    </td>
                </tr>

                <tr>
                    <td style="padding:10px;border-bottom:1px solid #eee;">
                        <strong>🔢 Quantity</strong>
                    </td>
                    <td style="padding:10px;border-bottom:1px solid #eee;">
                        ${order.quantity}
                    </td>
                </tr>

                <tr>
                    <td style="padding:10px;">
                        <strong>💰 Total</strong>
                    </td>
                    <td style="
                        padding:10px;
                        color:#2563eb;
                        font-size:18px;
                        font-weight:bold;
                    ">
                        ₹${order.total_price}
                    </td>
                </tr>

            </table>

            <div style="text-align:center;margin-top:30px;">

                <a href="http://localhost:3000/orders"
                    style="
                        background:#2563eb;
                        color:white;
                        padding:12px 22px;
                        text-decoration:none;
                        border-radius:6px;
                        display:inline-block;
                    ">
                    View My Orders
                </a>

            </div>

        </div>

        <!-- Footer -->
        <div style="
            background:#f5f5f5;
            text-align:center;
            padding:15px;
            color:#777;
            font-size:13px;
        ">
            Thank you for shopping with us ❤️
            <br><br>
            © 2026 Product Management
        </div>

    </div>
    `;
};

export default orderConfirmedTemplate;