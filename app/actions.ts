
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addBookmark(title: string, url: string, userId: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("bookmarks").insert({
        title,
        url,
        user_id: userId,
    });

    if (error) {
        console.error("Error adding bookmark:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true };
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
        console.error("Error deleting bookmark:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true };
}
