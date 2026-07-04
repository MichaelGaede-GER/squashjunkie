const form = document.getElementById("registerForm");
const errorEl = document.getElementById("error");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.style.display = "none";
  submitBtn.disabled = true;
  submitBtn.textContent = t("register.submitting");

  const payload = {
    p_name: document.getElementById("name").value.trim(),
    p_captain_name: document.getElementById("captainName").value.trim(),
    p_captain_email: document.getElementById("captainEmail").value.trim(),
    p_captain_phone: document.getElementById("captainPhone").value.trim(),
  };

  const { data: code, error } = await sb.rpc("register_team", payload);

  submitBtn.disabled = false;
  submitBtn.textContent = t("register.submit");

  if (error) {
    errorEl.textContent = translateDbError(error);
    errorEl.style.display = "block";
    return;
  }

  window.location.href = `team.html?code=${encodeURIComponent(code)}&welcome=1`;
});
