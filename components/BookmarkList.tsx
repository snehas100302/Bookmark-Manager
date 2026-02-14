
"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import { deleteBookmark } from "@/app/actions";
import { useRouter } from "next/navigation";

interface Bookmark {
    id: string;
    title: string;
    url: string;
    created_at: string;
}

export default function BookmarkList({
    initialBookmarks = [],
}: {
    initialBookmarks?: Bookmark[];
}) {
    const [supabase] = useState(() => createClient());
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [status, setStatus] = useState<string>("CONNECTING");

    useEffect(() => {
        // Check current user
        supabase.auth.getUser().then(({ data }) => {
            console.log("Current user:", data.user?.id);
        });
    }, [supabase]);

    useEffect(() => {
        // Update bookmarks when initialBookmarks changes (e.g., after router.refresh())
        setBookmarks(initialBookmarks);
    }, [initialBookmarks]);

    useEffect(() => {
        let isActive = true;
        const channelName = `bookmarks-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        // Small delay to let React Strict Mode cleanup finish
        const timer = setTimeout(() => {
            if (!isActive) return;

            const channel = supabase
                .channel(channelName)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "bookmarks",
                    },
                    (payload) => {
                        console.log("Realtime Event Received:", payload);
                        if (payload.eventType === "INSERT") {
                            const newBookmark = payload.new as Bookmark;
                            setBookmarks((prev) => {
                                if (prev.some((b) => b.id === newBookmark.id)) return prev;
                                return [newBookmark, ...prev];
                            });
                        } else if (payload.eventType === "DELETE") {
                            setBookmarks((prev) =>
                                prev.filter((bookmark) => bookmark.id !== payload.old.id)
                            );
                        } else if (payload.eventType === "UPDATE") {
                            setBookmarks((prev) =>
                                prev.map((bookmark) =>
                                    bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
                                )
                            );
                        }
                    }
                )
                .subscribe((state) => {
                    console.log("Realtime connection status:", state);
                    if (isActive) setStatus(state);
                });

            // Store channel reference for cleanup
            channelRef = channel;
        }, 100);

        let channelRef: ReturnType<typeof supabase.channel> | null = null;

        return () => {
            isActive = false;
            clearTimeout(timer);
            if (channelRef) {
                supabase.removeChannel(channelRef);
            }
        };
    }, [supabase]);


    if (bookmarks.length === 0) {
        return (
            <div>
                <div className="text-center py-10 text-gray-500">No bookmarks yet. Add one above!</div>
                <div className="text-xs text-gray-400 text-center mt-4">
                    Realtime Status: <span className={status === "SUBSCRIBED" ? "text-green-500" : "text-amber-500"}>{status}</span>
                </div>
            </div>
        );
    }

    const handleDelete = async (id: string) => {
        const result = await deleteBookmark(id);
        if (!result.success) {
            alert("Failed to delete bookmark: " + result.error);
        } else {
            router.refresh();
        }
    };

    return (
        <ul className="grid grid-cols-1 gap-4 w-full">
            {bookmarks.map((bookmark) => (
                <li
                    key={bookmark.id}
                    className="group bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-center animate-in fade-in slide-in-from-bottom-2"
                >
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-xl text-card-foreground hover:text-primary transition-colors flex items-center gap-2 break-words"
                        >
                            {bookmark.title}
                            <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                        <span className="text-base text-muted-foreground truncate max-w-full">{bookmark.url}</span>
                    </div>
                    <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="ml-4 text-destructive hover:text-destructive-foreground hover:bg-destructive p-3 rounded-full transition-all focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                        aria-label={`Delete bookmark: ${bookmark.title}`}
                        title="Delete bookmark"
                    >
                        <Trash2 size={24} />
                    </button>
                </li>
            ))}
            <div className="text-xs text-muted-foreground text-center pt-6 pb-2">
                Realtime Status: <span className={status === "SUBSCRIBED" ? "text-green-600 font-medium" : "text-amber-500 font-medium"}>{status}</span>
            </div>
        </ul>
    );
}
