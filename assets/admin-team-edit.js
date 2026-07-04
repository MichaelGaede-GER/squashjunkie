const code = (new URLSearchParams(window.location.search).get("code") || "").toUpperCase();

async function saveCaptainInfo() {
  const { error } = await sb
    .from("teams")
    .update({
      captain_name: document.getElementById("captainName").value.trim(),
      captain_email: document.getElementById("captainEmail").value.trim(),
      captain_phone: document.getElementById("captainPhone").value.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("access_code", code);
  return { error };
}

async function init() {
  const session = await requireAdminSession();
  if (!session) return;
  wireLogoutButton();

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

  const team = teamData.team;
  document.getElementById("codeLabel").textContent = team.access_code;
  document.getElementById("teamName").value = team.name;
  document.getElementById("captainName").value = team.captain_name;
  document.getElementById("captainEmail").value = team.captain_email;
  document.getElementById("captainPhone").value = team.captain_phone;

  const editor = createRosterEditor({
    settings,
    editable: true, // Admin ignoriert die Bearbeitungsfrist
    onSave: async (name, players) => {
      const captainResult = await saveCaptainInfo();
      if (captainResult.error) return captainResult;
      return sb.rpc("save_team_roster", {
        p_code: code,
        p_name: name,
        p_players: players,
        p_admin: true,
      });
    },
  });

  editor.loadPlayers(teamData.players);
  editor.setEditableUI();
  editor.renderAll();

  document.getElementById("loadingMsg").style.display = "none";
  document.getElementById("content").style.display = "block";
}

init();
