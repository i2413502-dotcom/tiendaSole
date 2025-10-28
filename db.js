// db.js
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://dkouucghnlhxgtgsxsfd.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Lta1ePe4rLripLCwq_u8Lw_YazBAAbM'

// Cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

module.exports = { supabase }
