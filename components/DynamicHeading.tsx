"use client";

import { useState, useEffect } from "react";

const phrases = [
    "Smart Bookmark Manager",
    "Save Your Favorites",
    "Access From Anywhere",
    "Organize With Ease",
    "Real-Time Sync",
];

export default function DynamicHeading() {
    const [currentPhrase, setCurrentPhrase] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const phrase = phrases[currentPhrase];
        let timeout: NodeJS.Timeout;

        if (!isDeleting && displayText === phrase) {
            // Pause at full text, then start deleting
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayText === "") {
            // Move to next phrase
            setIsDeleting(false);
            setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        } else if (isDeleting) {
            // Delete one character
            timeout = setTimeout(() => {
                setDisplayText(phrase.substring(0, displayText.length - 1));
            }, 40);
        } else {
            // Type one character
            timeout = setTimeout(() => {
                setDisplayText(phrase.substring(0, displayText.length + 1));
            }, 80);
        }

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentPhrase]);

    return (
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl min-h-[1.2em]">
            <span className="text-white drop-shadow-lg">
                {displayText}
            </span>
            <span className="animate-pulse text-white ml-0.5">|</span>
        </h1>
    );
}
