import {createClient} from '@supabase/supabase-js'

const PROJECT_URL = "https://yywsctrigyuzgawkkiku.supabase.co"
const PUBLIC_ANON_KEY= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5d3NjdHJpZ3l1emdhd2traWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTYzMjcwNjMsImV4cCI6MTk3MTkwMzA2M30.HGcl9G_Ai1ob806vFvBHKkeVCGlgUknDyZvXVTSDafc"
const supabase = createClient(PROJECT_URL, PUBLIC_ANON_KEY)

export {
    supabase
};