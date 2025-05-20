import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://htuuzmkqxjlwuaqjeugs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dXV6bWtxeGpsd3VhcWpldWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MTk4MDcsImV4cCI6MjA2MDI5NTgwN30.aNTknbIXRRxG9VOkA_vWIVzi8sPk-lfgs__OQhZwsp8";

if (!supabaseUrl || !supabaseKey) {
  console.error('Credenciais do Supabase não configuradas. Verifique o arquivo .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;