# Squash Junkies — Turnier-Webseite (statische Version)

Reines HTML/CSS/JavaScript ohne Build-Schritt. Die Datenbank laeuft auf
**Supabase** (Postgres), direkt aus dem Browser angesprochen ueber den
`@supabase/supabase-js`-Client (per CDN eingebunden). Gehostet wird die Seite
z.B. ueber **GitHub Pages** — genau wie bei deinem anderen Projekt.

## Module

1. **Einstellungen** (`admin/settings.html`): Turniername, max. Anzahl Teams,
   Startgebuehr pro Spieler/Supporter, angebotene Shirtgroessen, Eventdaten,
   Anmeldefrist und Bearbeitungsfrist fuer Captains.
2. **Registrierung**:
   - `register.html`: Neues Team anlegen. Nach dem Absenden gibt es einen
     **Zugangscode** (kein Passwort-Login fuer Captains).
   - `team.html?code=...`: Der Captain verwaltet darueber seine Mannschaft mit
     klaren **Positionen**: M1–M4 (Herren) und W1–W2 (Damen) sind Pflicht,
     jede weitere per Klick hinzugefuegte Position wird automatisch zum
     Ersatzspieler (M5, M6, … bzw. W3, W4, …). Pro Person: E-Mail,
     Mobilnummer, Shirtgroesse. Zusaetzlich beliebig viele Supporter. Der
     Gesamtbetrag wird live berechnet, editierbar bis zur Bearbeitungsfrist.
3. **Dashboard** (`admin/dashboard.html`): Uebersicht aller Teams mit Zahlen
   zu Herren/Damen/Ersatz/Supporter, Einnahmen, Fristenstatus. Über
   **"Bearbeiten"** gelangt man zu `admin/team-edit.html`, wo der Admin
   **jedes Team komplett einsehen und bearbeiten** kann (Teamname,
   Captain-Kontakt, komplette Aufstellung) — unabhängig von der
   Bearbeitungsfrist der Captains.
4. **Berichte** (`admin/reports.html`): PDF-Export (wird direkt im Browser
   erzeugt) fuer Teamliste (inkl. Positionen M1-M4/W1-W2/Ersatz und
   Kontaktdaten) und Shirtgroessen-Bestellung.

**Sprache**: Die komplette Seite ist zweisprachig (Englisch als Standard,
umschaltbar auf Deutsch ueber den EN/DE-Schalter oben auf jeder Seite). Die
Auswahl wird im Browser gespeichert (localStorage) und gilt seitenuebergreifend.

## 1. Supabase-Projekt einrichten

1. Auf [supabase.com](https://supabase.com) ein neues Projekt anlegen.
2. Im Projekt unter **SQL Editor -> New query** den kompletten Inhalt von
   `sql/schema.sql` einfuegen und ausfuehren. Das legt Tabellen, Zugriffs-
   regeln (RLS) und alle noetigen Funktionen an, inkl. Beispiel-Einstellungen.
   Das Skript ist so geschrieben, dass es auch ein zweites Mal (z.B. nach
   einem Update) gefahrlos komplett neu ausgefuehrt werden kann.
3. Unter **Authentication -> Users -> Add user** einen Admin-Account anlegen
   (E-Mail + Passwort). Das ist dein Login fuer den Admin-Bereich — es gibt
   bewusst keine offene Registrierung, damit sich nicht irgendjemand selbst
   Admin-Rechte holen kann.
4. Unter **Project Settings -> API** die "Project URL" und den "anon public"
   Key kopieren.

## 2. Projekt konfigurieren

`assets/supabase-client.js` oeffnen und die beiden Platzhalter ersetzen:

```js
const SUPABASE_URL = "https://DEIN-PROJEKT.supabase.co";
const SUPABASE_ANON_KEY = "DEIN-ANON-KEY";
```

Das ist der einzige Schritt, der vor dem Hochladen noetig ist — es gibt
keinen `npm install` und keinen Build-Prozess.

## 3. Lokal testen (optional)

Da es reine HTML-Dateien sind, reicht ein simpler lokaler Webserver, z.B.:

```bash
npx serve .
```

und dann `http://localhost:3000` im Browser oeffnen. Zuerst unter
`admin/login.html` einloggen und in **Einstellungen** das Turnier
konfigurieren (Datum, Preise etc.), damit auf der Startseite die Anmeldung
freigeschaltet wird.

## 4. Auf GitHub hochladen und ueber GitHub Pages veroeffentlichen

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<dein-user>/squash-junkies.git
git push -u origin main
```

Dann auf GitHub: **Settings -> Pages -> Source: Deploy from a branch ->
Branch: main / (root)** auswaehlen und speichern. Nach ein bis zwei Minuten
ist die Seite unter `https://<dein-user>.github.io/squash-junkies/` live.

## Projektstruktur

```
index.html                  Startseite (oeffentlich)
register.html                Team-Registrierung
team.html                    Captain-Ansicht zur Team-Verwaltung (?code=...)
admin/login.html              Admin-Login (Supabase Auth)
admin/dashboard.html          Modul 3 (mit Link zu team-edit.html je Team)
admin/team-edit.html          Admin: beliebiges Team einsehen/bearbeiten
admin/settings.html           Modul 1
admin/reports.html            Modul 4 (PDF-Erzeugung im Browser)
assets/style.css              Gemeinsames Design
assets/i18n.js                 Uebersetzungen EN/DE + Sprachumschalter
assets/supabase-client.js     Supabase-Verbindung (hier URL/Key eintragen)
assets/roster-editor.js       Gemeinsame Aufstellungs-Logik (Captain + Admin)
assets/*.js                   Seiten-Logik
sql/schema.sql                Tabellen, Sicherheitsregeln, Funktionen fuer Supabase
```

## Wie die Sicherheit funktioniert

- Captains kommen **nie direkt** an die Tabellen `teams`/`players` heran,
  sondern nur ueber drei Datenbankfunktionen (`register_team`,
  `get_team_by_code`, `save_team_roster`). Diese pruefen Fristen, Team-Limits
  und die Pflichtaufstellung serverseitig in Supabase — nicht nur im Browser.
  Dadurch kann niemand einfach alle E-Mail-Adressen abgreifen, selbst wenn er
  den Datenbank-Namen kennt.
- Der Admin-Bereich nutzt echte Supabase-Auth-Accounts (E-Mail + Passwort),
  keine geteilten Passwoerter. Nur eingeloggte Nutzer duerfen die komplette
  Teamliste sehen oder Einstellungen aendern (siehe Row-Level-Security-Regeln
  in `sql/schema.sql`).
- Der `anon`-Key in `assets/supabase-client.js` ist bewusst oeffentlich (er
  steht sichtbar im Browser-Code) — das ist bei Supabase so vorgesehen, der
  eigentliche Schutz laeuft ueber die Datenbank-Regeln, nicht ueber Geheimhaltung
  des Keys.

## Ausbaumoeglichkeiten

- **E-Mail-Versand** des Zugangscodes an den Captain: aktuell wird der Code
  nur auf der Webseite angezeigt. Am einfachsten liesse sich das ueber eine
  Supabase Edge Function + einen E-Mail-Dienst (z.B. Resend) ergaenzen.
- **Online-Zahlung**: Betraege werden nur berechnet/angezeigt. Fuer echtes
  Einziehen z.B. Stripe Checkout (als Supabase Edge Function oder externer
  Link) ergaenzen.
