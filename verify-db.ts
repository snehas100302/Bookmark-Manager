
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verify() {
    console.log('Testing Supabase connection...')

    // Try to select from the bookmarks table
    const { data, error } = await supabase
        .from('bookmarks')
        .select('count', { count: 'exact', head: true })

    if (error) {
        console.error('Error connecting to Supabase or fetching bookmarks:', error.message)
        if (error.code === '42P01') { // undefined_table
            console.error('The "bookmarks" table does not exist. Please run the SQL schema.')
        }
        process.exit(1)
    }

    console.log('Success! Connected to Supabase and "bookmarks" table exists.')
}

verify()
