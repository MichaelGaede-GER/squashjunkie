// ============================================================
// Hier deine Supabase-Projektdaten eintragen:
// Supabase Dashboard -> Project Settings -> API
//   - "Project URL"       -> SUPABASE_URL
//   - "anon public" Key   -> SUPABASE_ANON_KEY
// Der anon key ist bewusst oeffentlich (er steht im Browser-Code) -
// der eigentliche Schutz laeuft ueber die RLS-Regeln in sql/schema.sql.
// ============================================================

const SUPABASE_URL = "https://rzrrigljajctuhbckijz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6cnJpZ2xqYWpjdHVoYmNraWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNjA3MDAsImV4cCI6MjA5ODczNjcwMH0.5DnQ8R2xeUxbs0z9DziOFLDS40R6CrJorWwUjaTCpk4";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);