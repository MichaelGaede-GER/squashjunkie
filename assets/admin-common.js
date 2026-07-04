// Muss auf jeder geschuetzten Admin-Seite VOR der seiteneigenen Logik
// eingebunden werden. Leitet zum Login um, falls keine Supabase-Session
// vorhanden ist. Die eigentliche Datenabsicherung passiert serverseitig
// ueber die RLS-Regeln in sql/schema.sql - diese Pruefung ist nur fuer
// eine saubere Benutzerfuehrung im Browser.
async function requireAdminSession() {
  const { data } = await sb.auth.getSession();
  if (!data.session) {
    window.location.href = "login.html";
    return null;
  }
  return data.session;
}

function wireLogoutButton() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    await sb.auth.signOut();
    window.location.href = "login.html";
  });
}
