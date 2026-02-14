
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default async function Navbar() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <nav className="border-b border-border/50 bg-transparent backdrop-blur-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-foreground">
                            Smart Bookmark App
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    {user.email}
                                </span>
                                <form action="/auth/signout" method="post">
                                    <button
                                        type="submit"
                                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        ) : (
                            null
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
