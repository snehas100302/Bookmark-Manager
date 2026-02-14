"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { addBookmark } from "@/app/actions";
import { useRouter } from "next/navigation";


export default function AddBookmark({ userId }: { userId: string }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !url) return;

        setLoading(true);

        try {
            const result = await addBookmark(title, url, userId);
            console.log("result", result);
            if (!result.success) {
                alert("Error adding bookmark: " + result.error);
            } else {
                setTitle("");
                setUrl("");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("Unexpected error occurred");
        } finally {
            setLoading(false);
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-10 w-full">
            <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="title" className="sr-only">Title</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Title (e.g., Google)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-card text-card-foreground border border-input p-4 rounded-xl text-lg shadow-sm focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                />
            </div>
            <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="url" className="sr-only">URL</label>
                <input
                    id="url"
                    type="url"
                    placeholder="URL (e.g., https://google.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-card text-card-foreground border border-input p-4 rounded-xl text-lg shadow-sm focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground text-lg font-medium px-8 py-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 min-w-[120px]"
                aria-label="Add bookmark"
            >
                {loading ? "..." : <><Plus size={24} /> Add</>}
            </button>
        </form>
    );
}
