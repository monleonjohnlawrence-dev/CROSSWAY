import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upgzobkhmhfjkhmchlkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZ3pvYmtobWhmamtobWNobGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTMxMDksImV4cCI6MjA4NTEyOTEwOX0.pLFR3OpIgJRQpxtWpAcwqonYOk6iPYGXYYlT2qXs59w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Only use AsyncStorage if we are NOT on the server
    storage: Platform.OS !== 'web' || typeof window !== 'undefined' ? AsyncStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});