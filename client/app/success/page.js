"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
    const [message, setMessage] = useState("Processing your order...");
    const searchParams = useSearchParams();

    useEffect(() => {
        const session_id = searchParams.get("session_id");
        const user_id = localStorage.getItem("user_id");

        if (!session_id || !user_id) {
            setMessage("Invalid session!");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/payment-success`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id,
                session_id,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setMessage("Order placed successfully! ✅");

                    setTimeout(() => {
                        window.location.href = "/orders";
                    }, 2000);
                } else {
                    setMessage(data.message);
                }
            });
    }, [searchParams]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: "16px",
            }}
        >
            <h1>🎉 Payment Successful!</h1>
            <p>{message}</p>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <SuccessContent />
        </Suspense>
    );
}