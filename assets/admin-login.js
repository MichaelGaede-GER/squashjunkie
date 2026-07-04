// Falls bereits eingeloggt, direkt zum Dashboard
sb.auth.getSession().then(({ data }) => {
  if (data.session) window.location.href = "dashboard.html";
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById("error");
  const submitBtn = document.getElementById("submitBtn");
  errorEl.style.display = "none";
  submitBtn.disabled = true;
  submitBtn.textContent = t("adminLogin.checking");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const { error } = await sb.auth.signInWithPassword({ email, password });

  submitBtn.disabled = false;
  submitBtn.textContent = t("adminLogin.button");

  if (error) {
    console.error("Supabase Login-Fehler:", error);
    errorEl.textContent = t("adminLogin.errorPrefix", { message: error.message });
    errorEl.style.display = "block";
    return;
  }

  window.location.href = "dashboard.html";
});
