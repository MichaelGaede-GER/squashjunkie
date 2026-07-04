// ============================================================
// Einfaches i18n-System ohne Build-Schritt. Sprache wird in
// localStorage gespeichert (Standard: Englisch). Jede Seite bindet
// dieses Script vor ihrer eigenen Logik ein und ruft ggf. t(key)
// fuer dynamisch erzeugte Texte auf. Statische Texte im HTML nutzen
// data-i18n="key" (Textinhalt) bzw. data-i18n-placeholder="key".
// ============================================================

const I18N = {
  en: {
    "common.back": "← Back",
    "common.save": "Save",
    "common.saving": "Saving…",
    "common.saved": "Saved ✓",
    "common.loading": "Loading…",

    "nav.dashboard": "Dashboard",
    "nav.settings": "Settings",
    "nav.reports": "Reports",
    "nav.logout": "Logout",

    "home.eyebrow": "TEAM SQUASH TOURNAMENT",
    "home.subtitle": "4 men, 2 women, one team. Register your squad and compete for the title.",
    "home.stat.date": "Date",
    "home.stat.fee": "Entry fee",
    "home.stat.teams": "Teams",
    "home.teams.registered": "{count} / {max} registered",
    "home.fee.line": "{player} € / player · {supporter} € / supporter",
    "home.register.title": "Register a new team",
    "home.register.open": "Registration open until {date}. {spots} spots left.",
    "home.register.closed": "Registration is currently closed.",
    "home.register.button": "Register team",
    "home.register.closedButton": "Registration closed",
    "home.login.title": "Log in as captain",
    "home.login.desc": "Enter the access code you received during registration.",
    "home.login.placeholder": "e.g. K7M2PQXT",
    "home.login.button": "Go",
    "home.adminLink": "Admin login →",
    "home.notConfigured": "The tournament hasn't been set up yet.",

    "register.title": "Register team",
    "register.heading": "Register team",
    "register.desc": "After submitting you'll get an access code that the captain can use to manage the roster (4 men, 2 women + substitutes).",
    "register.teamName": "Team name",
    "register.captainName": "Captain's name",
    "register.captainEmail": "Captain's email",
    "register.captainPhone": "Captain's mobile number",
    "register.submit": "Create team",
    "register.submitting": "Creating…",
    "register.genericError": "Something went wrong.",

    "team.title": "Manage team",
    "team.loading": "Loading team…",
    "team.notFound": "Team not found. Please check the access code.",
    "team.welcome": "Your team has been created! Remember your access code: {code} — you can use it to come back to this page any time.",
    "team.heading": "Manage team",
    "team.code": "Code:",
    "team.deadlinePassed": "The edit deadline was {date}. The roster is now view-only.",
    "team.teamName": "Team name",
    "team.stat.men": "Men",
    "team.stat.women": "Women",
    "team.stat.price": "Total entry fee",
    "team.minMen": "{count} (min. 4)",
    "team.minWomen": "{count} (min. 2)",
    "team.men.heading": "Men",
    "team.men.desc": "Positions M1–M4 are mandatory, every additional position becomes a substitute automatically (M5, M6, …).",
    "team.women.heading": "Women",
    "team.women.desc": "Positions W1–W2 are mandatory, every additional position becomes a substitute automatically (W3, W4, …).",
    "team.supporters.heading": "Supporters",
    "team.addMan": "+ Add man",
    "team.addWoman": "+ Add woman",
    "team.addSupporter": "+ Add supporter",
    "team.field.firstName": "First name",
    "team.field.lastName": "Last name",
    "team.field.email": "Email",
    "team.field.mobile": "Mobile",
    "team.field.shirt": "Shirt",
    "team.remove": "Remove",
    "team.position.supporter": "Supporter",
    "team.saveError": "Save failed.",

    "adminLogin.title": "Admin login",
    "adminLogin.email": "Email",
    "adminLogin.password": "Password",
    "adminLogin.button": "Log in",
    "adminLogin.checking": "Checking…",
    "adminLogin.errorPrefix": "Login failed: {message}",

    "dashboard.notConfigured": "No settings have been configured yet.",
    "dashboard.setupNow": "Set up now",
    "dashboard.toReports": "Go to reports",
    "dashboard.metric.teams": "Teams registered",
    "dashboard.metric.complete": "Complete teams",
    "dashboard.metric.revenue": "Expected revenue",
    "dashboard.metric.registration": "Registration",
    "dashboard.registrationOpen": "open",
    "dashboard.registrationClosed": "closed",
    "dashboard.metric.menTotal": "Men total",
    "dashboard.metric.womenTotal": "Women total",
    "dashboard.metric.subs": "of which substitutes",
    "dashboard.metric.supporters": "Supporters",
    "dashboard.editStatus": "Captains can currently {status} edit their teams (deadline: {date}).",
    "dashboard.editOpen": "still",
    "dashboard.editClosed": "no longer",
    "dashboard.table.heading": "Teams",
    "dashboard.table.team": "Team",
    "dashboard.table.captain": "Captain",
    "dashboard.table.contact": "Contact",
    "dashboard.table.men": "Men",
    "dashboard.table.women": "Women",
    "dashboard.table.subs": "Subs",
    "dashboard.table.supp": "Supp.",
    "dashboard.table.amount": "Amount",
    "dashboard.table.code": "Code",
    "dashboard.table.edit": "Edit",
    "dashboard.table.empty": "No teams registered yet.",

    "settings.heading": "Settings",
    "settings.tournamentName": "Tournament name",
    "settings.maxTeams": "Number of teams (max.)",
    "settings.pricePlayer": "Entry fee / player (€)",
    "settings.priceSupporter": "Entry fee / supporter (€)",
    "settings.shirtSizes": "Available shirt sizes (comma-separated)",
    "settings.eventStart": "Event start",
    "settings.eventEnd": "Event end",
    "settings.registrationDeadline": "Registration open until",
    "settings.editDeadline": "Captains can edit teams until",
    "settings.saveError": "Save failed.",

    "reports.heading": "Reports",
    "reports.teamsPdf.title": "Team list (PDF)",
    "reports.teamsPdf.desc": "All teams with players, contact details (email/mobile), role and shirt size.",
    "reports.shirtsPdf.title": "Shirt order (PDF)",
    "reports.shirtsPdf.desc": "Overall shirt size totals plus a breakdown per team.",
    "reports.generating": "Generating PDF…",
    "reports.pdf.teamsSubtitle": "Team list · as of {date} · {count} teams",
    "reports.pdf.captainLine": "Captain: {name} · {email} · {phone}",
    "reports.pdf.noPlayers": "(no players registered yet)",
    "reports.pdf.shirtSubtitle": "Shirt size order · as of {date}",
    "reports.pdf.overview": "Overview",
    "reports.pdf.perTeam": "By team",
    "reports.pdf.pieces": "pcs",

    "teamEdit.heading": "Edit team",
    "teamEdit.backToDashboard": "← Back to dashboard",
    "teamEdit.loading": "Loading team…",
    "teamEdit.notFound": "Team not found.",
    "teamEdit.code": "Code:",
    "teamEdit.adminNote": "As admin, saving ignores the captains' edit deadline.",
    "teamEdit.captainName": "Captain",
    "teamEdit.captainEmail": "Captain email",
    "teamEdit.captainPhone": "Captain mobile",

    "errors.ERR_NOT_CONFIGURED": "The tournament hasn't been configured yet.",
    "errors.ERR_REGISTRATION_CLOSED": "The registration deadline has already passed.",
    "errors.ERR_TEAM_FULL": "All team spots are already taken.",
    "errors.ERR_NAME_REQUIRED": "Please enter a team name.",
    "errors.ERR_INVALID_EMAIL": "Please enter a valid email address.",
    "errors.ERR_TEAM_NOT_FOUND": "Team not found. Please check the access code.",
    "errors.ERR_EDIT_DEADLINE_PASSED": "The team edit deadline has already passed.",
    "errors.ERR_MIN_MEN": "At least 4 men (positions M1-M4) are required (currently {count}).",
    "errors.ERR_MIN_WOMEN": "At least 2 women (positions W1-W2) are required (currently {count}).",
  },
  de: {
    "common.back": "← Zurueck",
    "common.save": "Speichern",
    "common.saving": "Speichert…",
    "common.saved": "Gespeichert ✓",
    "common.loading": "Lade…",

    "nav.dashboard": "Dashboard",
    "nav.settings": "Einstellungen",
    "nav.reports": "Berichte",
    "nav.logout": "Logout",

    "home.eyebrow": "MANNSCHAFTS-SQUASHTURNIER",
    "home.subtitle": "4 Herren, 2 Damen, ein Team. Meldet eure Mannschaft an und kaempft um den Titel.",
    "home.stat.date": "Termin",
    "home.stat.fee": "Startgebuehr",
    "home.stat.teams": "Teams",
    "home.teams.registered": "{count} / {max} angemeldet",
    "home.fee.line": "{player} € / Spieler · {supporter} € / Supporter",
    "home.register.title": "Neues Team anmelden",
    "home.register.open": "Anmeldung offen bis {date}. Noch {spots} Plaetze frei.",
    "home.register.closed": "Die Anmeldung ist aktuell geschlossen.",
    "home.register.button": "Team registrieren",
    "home.register.closedButton": "Anmeldung geschlossen",
    "home.login.title": "Als Captain einloggen",
    "home.login.desc": "Gib den Zugangscode ein, den du bei der Registrierung erhalten hast.",
    "home.login.placeholder": "z.B. K7M2PQXT",
    "home.login.button": "Los",
    "home.adminLink": "Admin-Login →",
    "home.notConfigured": "Das Turnier wurde noch nicht eingerichtet.",

    "register.title": "Team registrieren",
    "register.heading": "Team registrieren",
    "register.desc": "Nach dem Absenden erhaltet ihr einen Zugangscode, mit dem der Captain die Mannschaft (4 Herren, 2 Damen + Ersatzspieler) verwalten kann.",
    "register.teamName": "Teamname",
    "register.captainName": "Name des Captains",
    "register.captainEmail": "E-Mail des Captains",
    "register.captainPhone": "Mobilfunknummer des Captains",
    "register.submit": "Team anlegen",
    "register.submitting": "Wird angelegt…",
    "register.genericError": "Etwas ist schiefgelaufen.",

    "team.title": "Team verwalten",
    "team.loading": "Lade Team…",
    "team.notFound": "Team nicht gefunden. Bitte Zugangscode pruefen.",
    "team.welcome": "Euer Team wurde angelegt! Merkt euch euren Zugangscode: {code} — damit kommt ihr jederzeit wieder auf diese Seite.",
    "team.heading": "Team verwalten",
    "team.code": "Code:",
    "team.deadlinePassed": "Die Bearbeitungsfrist ist am {date} abgelaufen. Die Aufstellung ist nur noch zur Ansicht.",
    "team.teamName": "Teamname",
    "team.stat.men": "Herren",
    "team.stat.women": "Damen",
    "team.stat.price": "Startgebuehr gesamt",
    "team.minMen": "{count} (mind. 4)",
    "team.minWomen": "{count} (mind. 2)",
    "team.men.heading": "Herren",
    "team.men.desc": "Positionen M1–M4 sind Pflicht, jede weitere Position ist automatisch Ersatz (M5, M6, …).",
    "team.women.heading": "Damen",
    "team.women.desc": "Positionen W1–W2 sind Pflicht, jede weitere Position ist automatisch Ersatz (W3, W4, …).",
    "team.supporters.heading": "Supporter",
    "team.addMan": "+ Herr hinzufuegen",
    "team.addWoman": "+ Dame hinzufuegen",
    "team.addSupporter": "+ Supporter hinzufuegen",
    "team.field.firstName": "Vorname",
    "team.field.lastName": "Nachname",
    "team.field.email": "E-Mail",
    "team.field.mobile": "Mobil",
    "team.field.shirt": "Shirt",
    "team.remove": "Entfernen",
    "team.position.supporter": "Supporter",
    "team.saveError": "Speichern fehlgeschlagen.",

    "adminLogin.title": "Admin-Login",
    "adminLogin.email": "E-Mail",
    "adminLogin.password": "Passwort",
    "adminLogin.button": "Einloggen",
    "adminLogin.checking": "Prueft…",
    "adminLogin.errorPrefix": "Login fehlgeschlagen: {message}",

    "dashboard.notConfigured": "Es sind noch keine Einstellungen hinterlegt.",
    "dashboard.setupNow": "Jetzt einrichten",
    "dashboard.toReports": "Zu den Berichten",
    "dashboard.metric.teams": "Teams angemeldet",
    "dashboard.metric.complete": "Vollstaendige Teams",
    "dashboard.metric.revenue": "Einnahmen (Soll)",
    "dashboard.metric.registration": "Anmeldung",
    "dashboard.registrationOpen": "offen",
    "dashboard.registrationClosed": "geschlossen",
    "dashboard.metric.menTotal": "Herren gesamt",
    "dashboard.metric.womenTotal": "Damen gesamt",
    "dashboard.metric.subs": "davon Ersatz",
    "dashboard.metric.supporters": "Supporter",
    "dashboard.editStatus": "Team-Bearbeitung durch Captains ist aktuell {status} moeglich (Frist: {date}).",
    "dashboard.editOpen": "noch",
    "dashboard.editClosed": "nicht mehr",
    "dashboard.table.heading": "Teams",
    "dashboard.table.team": "Team",
    "dashboard.table.captain": "Captain",
    "dashboard.table.contact": "Kontakt",
    "dashboard.table.men": "Herren",
    "dashboard.table.women": "Damen",
    "dashboard.table.subs": "Ersatz",
    "dashboard.table.supp": "Supp.",
    "dashboard.table.amount": "Betrag",
    "dashboard.table.code": "Code",
    "dashboard.table.edit": "Bearbeiten",
    "dashboard.table.empty": "Noch keine Teams angemeldet.",

    "settings.heading": "Einstellungen",
    "settings.tournamentName": "Turniername",
    "settings.maxTeams": "Anzahl Mannschaften (max.)",
    "settings.pricePlayer": "Startgebuehr / Spieler (€)",
    "settings.priceSupporter": "Startgebuehr / Supporter (€)",
    "settings.shirtSizes": "Angebotene Shirtgroessen (kommagetrennt)",
    "settings.eventStart": "Event-Start",
    "settings.eventEnd": "Event-Ende",
    "settings.registrationDeadline": "Anmeldung moeglich bis",
    "settings.editDeadline": "Captains koennen Team bearbeiten bis",
    "settings.saveError": "Speichern fehlgeschlagen.",

    "reports.heading": "Berichte",
    "reports.teamsPdf.title": "Teamliste (PDF)",
    "reports.teamsPdf.desc": "Alle Teams mit Spielern, Kontaktdaten (E-Mail/Mobil), Rolle und Shirtgroesse.",
    "reports.shirtsPdf.title": "Shirtbestellung (PDF)",
    "reports.shirtsPdf.desc": "Gesamtuebersicht der Shirtgroessen sowie Aufschluesselung je Team.",
    "reports.generating": "Erzeuge PDF…",
    "reports.pdf.teamsSubtitle": "Teamliste · Stand {date} · {count} Teams",
    "reports.pdf.captainLine": "Captain: {name} · {email} · {phone}",
    "reports.pdf.noPlayers": "(noch keine Spieler gemeldet)",
    "reports.pdf.shirtSubtitle": "Shirtgroessen-Bestellung · Stand {date}",
    "reports.pdf.overview": "Gesamtuebersicht",
    "reports.pdf.perTeam": "Nach Team",
    "reports.pdf.pieces": "Stueck",

    "teamEdit.heading": "Team bearbeiten",
    "teamEdit.backToDashboard": "← Zurueck zum Dashboard",
    "teamEdit.loading": "Lade Team…",
    "teamEdit.notFound": "Team nicht gefunden.",
    "teamEdit.code": "Code:",
    "teamEdit.adminNote": "Als Admin ignorierst du beim Speichern die Bearbeitungsfrist der Captains.",
    "teamEdit.captainName": "Captain",
    "teamEdit.captainEmail": "Captain E-Mail",
    "teamEdit.captainPhone": "Captain Mobil",

    "errors.ERR_NOT_CONFIGURED": "Das Turnier ist noch nicht konfiguriert.",
    "errors.ERR_REGISTRATION_CLOSED": "Die Anmeldefrist ist bereits abgelaufen.",
    "errors.ERR_TEAM_FULL": "Alle Startplaetze sind bereits vergeben.",
    "errors.ERR_NAME_REQUIRED": "Bitte einen Teamnamen angeben.",
    "errors.ERR_INVALID_EMAIL": "Bitte eine gueltige E-Mail-Adresse angeben.",
    "errors.ERR_TEAM_NOT_FOUND": "Team nicht gefunden. Bitte Zugangscode pruefen.",
    "errors.ERR_EDIT_DEADLINE_PASSED": "Die Bearbeitungsfrist fuer Teams ist abgelaufen.",
    "errors.ERR_MIN_MEN": "Es werden mindestens 4 Herren (Position M1-M4) benoetigt (aktuell {count}).",
    "errors.ERR_MIN_WOMEN": "Es werden mindestens 2 Damen (Position W1-W2) benoetigt (aktuell {count}).",
  },
};

function getLang() {
  return localStorage.getItem("sj_lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("sj_lang", lang);
}

// t("key", { placeholder: value }) - looks up the current language,
// falls back to English, falls back to the key itself if missing.
function t(key, vars) {
  const lang = getLang();
  let str = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.split(`{${k}}`).join(v);
    }
  }
  return str;
}

// Uebersetzt einen Fehler, der von einer Supabase-RPC-Funktion kommt.
// Unsere SQL-Funktionen werfen Codes wie "ERR_MIN_MEN|4" (Code + optionaler
// Zahlenwert, mit | getrennt) statt fertiger Saetze, damit die Meldung hier
// sprachabhaengig zusammengebaut werden kann.
function translateDbError(error) {
  if (!error || !error.message) return t("register.genericError");
  const [code, param] = error.message.split("|");
  const key = `errors.${code}`;
  if (I18N.en[key]) return t(key, { count: param });
  return error.message;
}

function formatMoney(value) {
  const lang = getLang();
  const locale = lang === "de" ? "de-DE" : "en-GB";
  return `${Number(value).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function formatDate(dateStr) {
  const lang = getLang();
  const locale = lang === "de" ? "de-DE" : "en-GB";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
}

function translateNode(root) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  root.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
}

function translateStaticPage() {
  document.documentElement.lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === getLang());
  });
}

function initLangSwitcher() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang === getLang()) return;
      setLang(btn.dataset.lang);
      translateStaticPage();
      document.dispatchEvent(new CustomEvent("langchange"));
    });
  });
}

translateStaticPage();
initLangSwitcher();
