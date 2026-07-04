function sortByPosition(players) {
  // Sortierung: M1..M4, M5.., W1..W2, W3.., dann Supporter
  function rank(p) {
    if (p.type === "supporter") return [2, 0];
    const num = parseInt((p.position || "").replace(/\D/g, ""), 10) || 0;
    return [p.gender === "w" ? 1 : 0, num];
  }
  return [...players].sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    return ra[0] - rb[0] || ra[1] - rb[1];
  });
}

async function loadData() {
  const { data: settings } = await sb.from("settings").select("*").eq("id", 1).single();
  const { data: teams } = await sb
    .from("teams")
    .select("*, players(*)")
    .eq("status", "active")
    .order("name", { ascending: true });
  return { settings, teams: teams || [] };
}

function addHeader(doc, title, subtitle) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(20, 26, 23);
  doc.text(title, 15, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(subtitle, 15, 27);
  doc.setDrawColor(212, 255, 63);
  doc.setLineWidth(1.2);
  doc.line(15, 31, 195, 31);
  doc.setTextColor(0, 0, 0);
  return 40;
}

function ensureSpace(doc, y, needed) {
  if (y + needed > 285) {
    doc.addPage();
    return 20;
  }
  return y;
}

async function downloadTeamsPdf() {
  const { jsPDF } = window.jspdf;
  const { settings, teams } = await loadData();
  const doc = new jsPDF();
  let y = addHeader(
    doc,
    settings?.tournament_name || "Squash Junkies",
    t("reports.pdf.teamsSubtitle", { date: new Date().toLocaleDateString(), count: teams.length })
  );

  doc.setFontSize(9);
  for (const team of teams) {
    y = ensureSpace(doc, y, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(team.name, 15, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      t("reports.pdf.captainLine", { name: team.captain_name, email: team.captain_email, phone: team.captain_phone }),
      15,
      y
    );
    y += 6;
    doc.setTextColor(0, 0, 0);

    const players = sortByPosition(team.players || []);
    if (players.length === 0) {
      doc.setTextColor(150, 150, 150);
      doc.text(t("reports.pdf.noPlayers"), 17, y);
      doc.setTextColor(0, 0, 0);
      y += 6;
    } else {
      for (const p of players) {
        y = ensureSpace(doc, y, 6);
        const posLabel = (p.position || "\u2013").padEnd(10, " ");
        const line = `${posLabel} ${p.first_name} ${p.last_name}  |  ${t("team.field.shirt")} ${p.shirt_size}  |  ${p.email}  |  ${p.mobile}`;
        doc.text(line, 17, y);
        y += 5.5;
      }
    }
    y += 5;
  }

  doc.save("teamliste.pdf");
}

async function downloadShirtsPdf() {
  const { jsPDF } = window.jspdf;
  const { settings, teams } = await loadData();
  const sizes = (settings?.shirt_sizes || "XS,S,M,L,XL,XXL").split(",").map((s) => s.trim());

  const totals = Object.fromEntries(sizes.map((s) => [s, 0]));
  for (const team of teams) {
    for (const p of team.players || []) {
      if (p.shirt_size in totals) totals[p.shirt_size] += 1;
    }
  }

  const doc = new jsPDF();
  let y = addHeader(
    doc,
    settings?.tournament_name || "Squash Junkies",
    t("reports.pdf.shirtSubtitle", { date: new Date().toLocaleDateString() })
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(t("reports.pdf.overview"), 15, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  for (const size of sizes) {
    doc.text(`${size.padEnd(6, " ")}  ${totals[size]} ${t("reports.pdf.pieces")}`, 15, y);
    y += 6;
  }
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(t("reports.pdf.perTeam"), 15, y);
  y += 8;
  doc.setFont("helvetica", "normal");

  for (const team of teams) {
    y = ensureSpace(doc, y, 12);
    const perTeam = Object.fromEntries(sizes.map((s) => [s, 0]));
    for (const p of team.players || []) {
      if (p.shirt_size in perTeam) perTeam[p.shirt_size] += 1;
    }
    doc.setFontSize(9);
    doc.text(team.name, 15, y);
    y += 5;
    doc.setTextColor(100, 100, 100);
    doc.text(sizes.map((s) => `${s}:${perTeam[s]}`).join("  "), 17, y);
    doc.setTextColor(0, 0, 0);
    y += 7;
  }

  doc.save("shirtgroessen.pdf");
}

async function init() {
  const session = await requireAdminSession();
  if (!session) return;
  wireLogoutButton();
}

document.getElementById("teamsPdfBtn").addEventListener("click", async () => {
  document.getElementById("status").textContent = t("reports.generating");
  await downloadTeamsPdf();
  document.getElementById("status").textContent = "";
});

document.getElementById("shirtsPdfBtn").addEventListener("click", async () => {
  document.getElementById("status").textContent = t("reports.generating");
  await downloadShirtsPdf();
  document.getElementById("status").textContent = "";
});

init();
