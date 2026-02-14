
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own bookmarks
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

-- Enable Realtime for bookmarks table
alter publication supabase_realtime add table bookmarks;
