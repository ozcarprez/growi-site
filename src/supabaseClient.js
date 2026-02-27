import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ieujjmvwdoqomqyzgaqf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldWpqbXZ3ZG9xb21xeXpnYXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNTA0MjQsImV4cCI6MjA4NzcyNjQyNH0.OTsL6Jhxku12AGSmA5kZRCo9eDB7NT0j_jybaYGfYL0'

export const supabase = createClient(supabaseUrl, supabaseKey)
