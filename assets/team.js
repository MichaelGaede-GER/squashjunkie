const params = new URLSearchParams(window.location.search);
const code = (params.get("code") || "").toUpperCase();
const showWelcome = params.get("welcome") === "1";

let cachedSettings = null;
let cachedTeam = null;
let editableGlobal = true;

function renderHeader() {
  if (!cachedTeam) return;
  document.getElementById("codeLabel").textContent = cachedTeam.access_code;

  if (!editableGlobal) {
    const notice = document.getElementById("deadlineNotice");
    notice.style.display = "block";
    notice.textContent = t("team.deadlinePassed", { date: formatDate(cachedSettings.edit_deadline) });
  }

  if (showWelcome) {
    document.getElementById("welcomeText").textContent = t("team.welcome", { code: cachedTeam.access_code });
    document.getElementById("welcomeBanner").style.display = "block";
  }
}

async function init() {
  if (!code) {
    document.getElementById("loadingMsg").style.display = "none";
    document.getElementById("notFoundMsg").style.display = "block";
    return;
  }

  const [{ data: settings }, { data: teamData, error: teamError }] = await Promise.all([
    sb.from("settings").select("*").eq("id", 1).single(),
    sb.rpc("get_team_by_code", { p_code: code }),
  ]);

  if (teamError || !teamData) {
    document.getElementById("loadingMsg").style.display = "none";
    document.getElementById("notFoundMsg").style.display = "block";
    return;
  }

  cachedSettings = settings;
  cachedTeam = teamData.team;
  const editDeadline = new Date(settings.edit_deadline + "T23:59:59");
  editableGlobal = new Date() <= editDeadline;

  document.getElementById("teamName").value = cachedTeam.name;
  renderHeader();

  const editor = createRosterEditor({
    settings,
    editable: editableGlobal,
    onSave: (name, players) =>
      sb.rpc("save_team_roster", { p_code: code, p_name: name, p_players: players }),
  });

  editor.loadPlayers(teamData.players);
  editor.setEditableUI();
  editor.renderAll();

  document.getElementById("loadingMsg").style.display = "none";
  document.getElementById("content").style.display = "block";
}

document.addEventListener("langchange", renderHeader);

init();
