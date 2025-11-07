// db.js
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://xbktrcfwmzukqyffpjss.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia3RyY2Z3bXp1a3F5ZmZwanNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTY3OTgsImV4cCI6MjA3NzE5Mjc5OH0.hKlD2X6bC_yBeawLJmnewBBQ9JjEz5J8WoqBPKpcHkw'

// Cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

module.exports = { supabase }
