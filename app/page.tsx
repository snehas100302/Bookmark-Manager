
import { createClient } from "@/utils/supabase/server";
import AddBookmark from "@/components/AddBookmark";
import BookmarkList from "@/components/BookmarkList";
import LoginButton from "@/components/LoginButton";
import DynamicHeading from "@/components/DynamicHeading";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-w-full min-h-screen bg-background text-foreground transition-colors duration-300">
      {!user ? (
        <div
          className="relative min-h-screen flex items-center justify-center"
          style={{
            backgroundImage: "url('/landing-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 px-4 max-w-4xl mx-auto">
            <DynamicHeading />
            <p className="max-w-2xl text-xl sm:text-2xl text-white/80 leading-relaxed">
              Save, organize, and access your bookmarks from anywhere.
              <br />
              <span className="font-semibold text-white">Simple. Private. Real-time.</span>
            </p>
            <div className="mt-10">
              <LoginButton />
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Navbar />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-foreground tracking-tight">Add New Bookmark</h2>
                <AddBookmark userId={user.id} />
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-foreground tracking-tight">Your Bookmarks</h2>
                <BookmarkList
                  initialBookmarks={
                    (await supabase
                      .from("bookmarks")
                      .select("*")
                      .order("created_at", { ascending: false })
                      .then((res) => res.data)) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
