async function init() {
  const session = await requireAdminSession();
  if (!session) return;
  wireLogoutButton();

  const { data: settings } = await sb.from("settings").select("*").eq("id", 1).single();

  if (settings) {
    document.getElementById("tournamentName").value = settings.tournament_name;
    document.getElementById("maxTeams").value = settings.max_teams;
    document.getElementById("pricePlayer").value = settings.price_player;
    document.getElementById("priceSupporter").value = settings.price_supporter;
    document.getElementById("shirtSizes").value = settings.shirt_sizes;
    document.getElementById("eventStartDate").value = settings.event_start_date;
    document.getElementById("eventEndDate").value = settings.event_end_date;
    document.getElementById("registrationDeadline").value = settings.registration_deadline;
    document.getElementById("editDeadline").value = settings.edit_deadline;
  }
}

document.getElementById("saveBtn").addEventListener("click", async () => {
  const errorEl = document.getElementById("error");
  const saveBtn = document.getElementById("saveBtn");
  errorEl.style.display = "none";
  saveBtn.disabled = true;
  saveBtn.textContent = t("common.saving");

  const payload = {
    id: 1,
    tournament_name: document.getElementById("tournamentName").value.trim(),
    max_teams: Number(document.getElementById("maxTeams").value),
    price_player: Number(document.getElementById("pricePlayer").value),
    price_supporter: Number(document.getElementById("priceSupporter").value),
    shirt_sizes: document.getElementById("shirtSizes").value.trim(),
    event_start_date: document.getElementById("eventStartDate").value,
    event_end_date: document.getElementById("eventEndDate").value,
    registration_deadline: document.getElementById("registrationDeadline").value,
    edit_deadline: document.getElementById("editDeadline").value,
    updated_at: new Date().toISOString(),
  };

  const { error } = await sb.from("settings").upsert(payload);

  saveBtn.disabled = false;

  if (error) {
    errorEl.textContent = error.message || t("settings.saveError");
    errorEl.style.display = "block";
    saveBtn.textContent = t("common.save");
    return;
  }

  saveBtn.textContent = t("common.saved");
  setTimeout(() => {
    saveBtn.textContent = t("common.save");
  }, 3000);
});

init();
