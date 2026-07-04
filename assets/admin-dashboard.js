function calcPrice(teamPlayers, pricePlayer, priceSupporter) {
  const playerCount = teamPlayers.filter((p) => p.type !== "supporter").length;
  const supporterCount = teamPlayers.filter((p) => p.type === "supporter").length;
  return playerCount * Number(pricePlayer) + supporterCount * Number(priceSupporter);
}

function countByGender(players, gender) {
  return players.filter((p) => p.type === "player" && p.gender === gender).length;
}

let cachedSettings = null;
let cachedTeams = [];

function renderDashboard() {
  if (!cachedSettings) return;
  const settings = cachedSettings;
  const allTeams = cachedTeams;
  const allPlayers = allTeams.flatMap((t) => t.players || []);

  const totalMen = countByGender(allPlayers, "m");
  const totalWomen = countByGender(allPlayers, "w");
  const totalSubs = allTeams.reduce((sum, t) => {
    const ps = t.players || [];
    return sum + Math.max(countByGender(ps, "m") - 4, 0) + Math.max(countByGender(ps, "w") - 2, 0);
  }, 0);
  const totalSupporters = allPlayers.filter((p) => p.type === "supporter").length;

  const completeTeams = allTeams.filter((t) => {
    const ps = t.players || [];
    return countByGender(ps, "m") >= 4 && countByGender(ps, "w") >= 2;
  }).length;

  const totalRevenue = allTeams.reduce(
    (sum, t) => sum + calcPrice(t.players || [], settings.price_player, settings.price_supporter),
    0
  );

  const now = new Date();
  const registrationOpen =
    now <= new Date(settings.registration_deadline + "T23:59:59") && allTeams.length < settings.max_teams;
  const editingOpen = now <= new Date(settings.edit_deadline + "T23:59:59");

  document.getElementById("title").textContent = settings.tournament_name;
  document.getElementById("mTeams").textContent = `${allTeams.length} / ${settings.max_teams}`;
  document.getElementById("mComplete").textContent = `${completeTeams} / ${allTeams.length}`;
  document.getElementById("mRevenue").textContent = formatMoney(totalRevenue);
  const regEl = document.getElementById("mRegOpen");
  regEl.textContent = registrationOpen ? t("dashboard.registrationOpen") : t("dashboard.registrationClosed");
  regEl.className = "stat-value" + (registrationOpen ? " text-ball" : "");

  document.getElementById("mMen").textContent = totalMen;
  document.getElementById("mWomen").textContent = totalWomen;
  document.getElementById("mSubs").textContent = totalSubs;
  document.getElementById("mSupporters").textContent = totalSupporters;

  document.getElementById("editStatusLine").innerHTML = t("dashboard.editStatus", {
    status: `<span class="${editingOpen ? "text-ball" : "text-warn"}">${editingOpen ? t("dashboard.editOpen") : t("dashboard.editClosed")}</span>`,
    date: formatDate(settings.edit_deadline),
  });

  const tbody = document.getElementById("teamsBody");
  if (allTeams.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:24px" class="text-muted">${t("dashboard.table.empty")}</td></tr>`;
  } else {
    tbody.innerHTML = allTeams
      .map((t2) => {
        const ps = t2.players || [];
        const men = countByGender(ps, "m");
        const women = countByGender(ps, "w");
        const subs = Math.max(men - 4, 0) + Math.max(women - 2, 0);
        const supps = ps.filter((p) => p.type === "supporter").length;
        const amount = calcPrice(ps, settings.price_player, settings.price_supporter);
        const complete = men >= 4 && women >= 2;
        const warnStyle = complete ? "" : ' style="color:#fbbf24"';
        return `<tr>
          <td>${t2.name}</td>
          <td>${t2.captain_name}</td>
          <td class="text-muted">${t2.captain_email}<br>${t2.captain_phone}</td>
          <td${warnStyle}>${t("team.minMen", { count: men })}</td>
          <td${warnStyle}>${t("team.minWomen", { count: women })}</td>
          <td>${subs}</td>
          <td>${supps}</td>
          <td>${formatMoney(amount)}</td>
          <td class="text-muted">${t2.access_code}</td>
          <td><a href="team-edit.html?code=${encodeURIComponent(t2.access_code)}" class="btn btn-secondary" style="font-size:12px;padding:6px 12px">${t("dashboard.table.edit")}</a></td>
        </tr>`;
      })
      .join("");
  }

  document.getElementById("content").style.display = "block";
}

async function init() {
  const session = await requireAdminSession();
  if (!session) return;
  wireLogoutButton();

  const { data: settings } = await sb.from("settings").select("*").eq("id", 1).single();
  if (!settings) {
    document.getElementById("notConfigured").style.display = "block";
    return;
  }

  const { data: teams } = await sb
    .from("teams")
    .select("*, players(*)")
    .eq("status", "active")
    .order("created_at", { ascending: true });

  cachedSettings = settings;
  cachedTeams = teams || [];
  renderDashboard();
}

document.addEventListener("langchange", renderDashboard);

init();
