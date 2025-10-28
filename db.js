const { createClient } = requiere ('@supabase/supabase-js')

const supabaseUrl = 'https://xbktrcfwmzukqyffpjss.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = { supabase }
