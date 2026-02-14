**Smart Bookmark Manager**

A robust, real-time bookmarking application built with Next.js, Supabase, and Tailwind CSS.

**Features**
- **Real-time Sync**: Add or delete bookmarks in one tab and see the changes instantly across all your open tabs.
- **Dynamic Theming**: Support for system-based themes with a manual toggle (Sun/Moon). High-contrast Light Blue and Dark Blue palette.
- **Responsive Design**: Fully optimized for PC, tablets, and mobile devices using Tailwind CSS.
- **Secure Authentication**: Power by Supabase (Google Auth supported).
- **Glassmorphism UI**: Beautiful transparent headers and modern design aesthetics.

 **Tech Stack**
- **Framework**: Next.js 15 (App Router)
- **Database/Auth/Realtime**: Supabase
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Deployment**: Vercel

**Troubleshooting & Lessons Learned**

During development, we encountered and resolved two major technical hurdles:

1. Real-time Synchronization Challenges
**Problem**: Initially, bookmarks wouldn't update automatically in other open tabs when a change was made.
- **Cause A**: Supabase Realtime is disabled by default for all tables for performance/security.
- **Cause B**: React Strict Mode in development was double-mounting components, causing WebSocket connections to close prematurely.

**Solution**:
1. Enabled the `bookmarks` table in the `supabase_realtime` publication via SQL Editor:
   ```sql
   alter publication supabase_realtime add table bookmarks;
   alter table bookmarks replica identity full;
   ```
2. Refactored the `BookmarkList` component to use a resilient subscription logic:
   - Implemented unique channel names per mount.
   - Added a small delay to avoid Strict Mode race conditions.
   - Used an `isActive` flag to prevent state updates on unmounted components.

2. Vercel Deployment Middleware Error
**Problem**: Upon initial deployment, the site returned a `500: INTERNAL_SERVER_ERROR` with the code `MIDDLEWARE_INVOCATION_FAILED`.
- **Cause**: The Next.js Middleware was trying to initialize the Supabase client but crashed because the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) were not set on Vercel.

**Solution**:
1. Used the **Vercel CLI** to link the local project to the Vercel dashboard.
2. Added the production environment variables via CLI:
   ```bash
   npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
   npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   ```
3. Triggered a production redeployment (`npx vercel --prod`), which resolved the crash.

**Responsive UI**
The application leverages **Tailwind CSS** to ensure a seamless experience across all screen sizes:
- **PC**: Wide grid layout for bookmarks.
- **Tablet**: Optimized spacing and font sizes.
- **Mobile**: Single-column layout with large touch targets for buttons.

Built with AI assistance by Antigravity.
