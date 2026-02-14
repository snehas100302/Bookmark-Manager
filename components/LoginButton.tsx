
"use client";

import { createClient } from "@/utils/supabase/client";

export default function LoginButton() {
    const supabase = createClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <button
            onClick={handleLogin}
            className="bg-sky-300 text-gray-900 text-lg font-medium px-8 py-4 rounded-xl hover:bg-sky-400 transition-all shadow-lg hover:shadow-xl active:scale-95 border-2 border-sky-500"
            aria-label="Sign in with Google"
        >
            Sign in with Google
        </button>
    );
}
