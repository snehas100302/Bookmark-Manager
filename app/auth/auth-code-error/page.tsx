"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AuthCodeError() {
    const [errorMessage, setErrorMessage] = useState("Something went wrong during sign-in.");

    useEffect(() => {
        // Parse the error from the URL hash fragment
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const error = params.get("error");

        if (error === "access_denied") {
            setErrorMessage("Sign-in was cancelled or access was denied.");
        } else if (error) {
            setErrorMessage(`Authentication error: ${error}`);
        }
    }, []);

    return (
        <div className="min-w-full min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="max-w-lg mx-auto px-6 py-16 text-center space-y-8">
                {/* Error Icon */}
                <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-destructive"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                    Sign-in Failed
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                    {errorMessage}
                </p>

                <p className="text-base text-muted-foreground">
                    Please try again or contact support if the issue persists.
                </p>

                <Link
                    href="/"
                    className="inline-block bg-primary text-primary-foreground text-lg font-medium px-8 py-4 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
