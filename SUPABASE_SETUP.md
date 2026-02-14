# Supabase Setup Guide

Here is a step-by-step guide to setting up your Supabase project for the Smart Bookmark App.

## 1. Create a New Project

1.  Go to [Supabase Dashboard](https://supabase.com/dashboard) and sign in.
2.  Click on **"New Project"**.
3.  Select an Organization (if prompted).
4.  Enter a **Name** (e.g., "Smart Bookmark App").
5.  Enter a strong **Database Password** (save this somewhere safe, though you likely won't need it often).
6.  Select a **Region** close to you.
7.  Click **"Create new project"**.
8.  Wait for the project to finish setting up (it might take a minute or two).

## 2. Run the SQL Schema

1.  In your project dashboard, look at the left sidebar and click on the **"SQL Editor"** icon (it looks like a terminal `>_`).
2.  Click **"New Query"**.
3.  Copy the entire content of the `supabase_schema.sql` file from your local project (content below for reference):

    ```sql
    -- Create bookmarks table
    CREATE TABLE bookmarks (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::timestamp, now()) NOT NULL
    );

    -- Enable RLS
    ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

    -- Policy: Users can select their own bookmarks
    CREATE POLICY "Users can select their own bookmarks"
    ON bookmarks FOR SELECT
    USING ( auth.uid() = user_id );

    -- Policy: Users can insert their own bookmarks
    CREATE POLICY "Users can insert their own bookmarks"
    ON bookmarks FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

    -- Policy: Users can delete their own bookmarks
    CREATE POLICY "Users can delete their own bookmarks"
    ON bookmarks FOR DELETE
    USING ( auth.uid() = user_id );
    ```

4.  Paste the code into the query editor.
5.  Click the **"Run"** button (bottom right of the editor).
6.  You should see a message saying "Success" or "No rows returned".

## 3. Enable Google Auth

### Part A: Get Requirements from Supabase
1.  In the Supabase dashboard, go to **Authentication** (icon looks like a users group) -> **Providers**.
2.  Click on **"Google"**.
3.  Toggle **"Enable Google"** to ON.
4.  Copy the **"Callback URL (for OAuth)"** (e.g., `https://<your-project-ref>.supabase.co/auth/v1/callback`). You will need this for Google Cloud.

### Part B: Configure Google Cloud Console
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a **New Project** (or select an existing one).
3.  Search for **"APIs & Services"** and go to **"OAuth consent screen"**.
4.  Select **"External"** and click "Create".
5.  Fill in the **App Name**, **User Support Email**, and **Developer Contact Information**. Click "Save and Continue".
6.  (Optional) Skip "Scopes" and "Test Users" for now by clicking "Save and Continue".
7.  Go to **"Credentials"** in the left sidebar.
8.  Click **"Create Credentials"** -> **"OAuth client ID"**.
9.  Application type: **"Web application"**.
10. Name: "Supabase Auth" (or anything).
11. Under **"Authorized redirect URIs"**, click "Add URI".
12. **Paste the Callback URL** you copied from Supabase in Part A.
13. Click **"Create"**.
14. A modal will appear with your **"Client ID"** and **"Client Secret"**. Copy these.

### Part C: Finish in Supabase
1.  Go back to your Supabase Dashboard tab (Authentication -> Providers -> Google).
2.  Paste the **Client ID** into the "Client ID" field.
3.  Paste the **Client Secret** into the "Client Secret" field.
4.  Click **"Save"**.

## 4. Get Project Credentials

1.  In Supabase, go to **Settings** (cog icon) -> **API**.
2.  Find **Project URL** and copy it.
3.  Find **anon** (public) key and copy it.
4.  Open your local `.env.local` file and paste them:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
    ```
