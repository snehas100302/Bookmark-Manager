
# Smart Bookmark App

A simple, real-time bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.

## Features

- **Google Authentication**: fast and secure sign-in.
- **Private Bookmarks**: store your favorite links securely.
- **Real-time Updates**: changes reflect instantly across all tabs/devices.
- **Modern UI**: clean, responsive design with dark mode support.

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed.
- A Supabase account.

### 2. Clone & Install

```bash
git clone <repository-url>
cd smart-bookmark-app
npm install
```

### 3. Supabase Configuration

1.  Create a new Supabase project.
2.  Go to **Authentication > Providers** and enable **Google**.
3.  Go to **SQL Editor** and run the contents of `supabase_schema.sql` to set up the database.

### 4. Environment Variables

Create a file named `.env.local` in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase Dashboard under **Project Settings > API**.

### 5. Google OAuth Setup

1.  In Supabase, copy the **Callback URL** from Auth > Providers > Google.
2.  Go to Google Cloud Console, create credentials, and paste the Callback URL.
3.  Add Google Client ID and Secret to Supabase.

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

This app is ready to act be deployed on Vercel.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add the Environment Variables (from step 4) in Vercel Project Settings.
4.  Deploy!
