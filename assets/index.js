let cachedSettings = null;
let cachedTeamCount = 0;

function renderHome() {
  if (!cachedSettings) return;
  const settings = cachedSettings;
  const teamCount = cachedTeamCount;

  document.getElementById("tournamentName").textContent = settings.tournament_name;

  const startLabel = formatDate(settings.event_start_date);
  const endLabel = formatDate(settings.event_end_date);
  document.getElementById("eventDates").textContent =
    settings.event_start_date === settings.event_end_date
      ? startLabel
      : `${startLabel} – ${endLabel}`;

  document.getElementById("prices").textContent = t("home.fee.line", {
    player: settings.price_player,
    supporter: settings.price_supporter,
  });

  document.getElementById("teamCount").textContent = t("home.teams.registered", {
    count: teamCount,
    max: settings.max_teams,
  });

  const now = new Date();
  const registrationOpen =
    now <= new Date(settings.registration_deadline + "T23:59:59") && teamCount < settings.max_teams;
  const spotsLeft = Math.max(settings.max_teams - teamCount, 0);

  const infoEl = document.getElementById("registrationInfo");
  if (registrationOpen) {
    infoEl.textContent = t("home.register.open", {
      date: formatDate(settings.registration_deadline),
      spots: spotsLeft,
    });
    document.getElementById("registerLink").style.display = "inline-flex";
    document.getElementById("registerClosedBtn").style.display = "none";
  } else {
    infoEl.textContent = t("home.register.closed");
    document.getElementById("registerLink").style.display = "none";
    document.getElementById("registerClosedBtn").style.display = "inline-flex";
  }
}

async function init() {
  const { data: settings, error: settingsError } = await sb
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (settingsError || !settings) {
    document.getElementById("registrationInfo").textContent = t("home.notConfigured");
    return;
  }

  const { data: stats } = await sb.rpc("get_public_stats");

  cachedSettings = settings;
  cachedTeamCount = stats?.team_count ?? 0;
  renderHome();
}

document.getElementById("codeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.getElementById("codeInput").value.trim().toUpperCase();
  if (code) window.location.href = `team.html?code=${encodeURIComponent(code)}`;
});

document.addEventListener("langchange", renderHome);

init();
