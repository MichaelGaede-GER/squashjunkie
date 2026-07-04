-- ============================================================
-- Squash Junkies - Datenbankschema fuer Supabase
-- ------------------------------------------------------------
-- Dieses komplette Skript im Supabase Dashboard unter
-- "SQL Editor" -> "New query" einfuegen und einmal ausfuehren.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Tabellen
-- ------------------------------------------------------------

create table if not exists settings (
  id                    int primary key default 1,
  tournament_name       text not null default 'Squash Junkies',
  max_teams             int not null default 16,
  price_player          numeric not null default 60,
  price_supporter       numeric not null default 30,
  -- kommagetrennte Liste, z.B. 'XS,S,M,L,XL,XXL'
  shirt_sizes           text not null default 'XS,S,M,L,XL,XXL',
  event_start_date      date not null,
  event_end_date        date not null,
  registration_deadline date not null,
  edit_deadline         date not null,
  updated_at            timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

create table if not exists teams (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  access_code   text not null unique,
  captain_name  text not null,
  captain_email text not null,
  captain_phone text not null,
  status        text not null default 'active', -- active | cancelled
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists players (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  first_name  text not null,
  last_name   text not null,
  gender      text,          -- 'm' | 'w' | null (bei Supportern leer)
  type        text not null default 'player', -- player | supporter
  -- Position im Team: M1-M4 = Pflichtpositionen Herren, W1-W2 = Pflicht Damen,
  -- M5+/W3+ = Ersatzspieler (automatisch fortlaufend vergeben). 'Supporter' bei Supportern.
  position    text,
  email       text not null,
  mobile      text not null,
  shirt_size  text not null,
  created_at  timestamptz not null default now()
);

-- Fuer bereits bestehende Installationen: Spalte ergaenzen, falls sie fehlt.
alter table players add column if not exists position text;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
-- Grundprinzip: Captains kommen NIE direkt an die Tabellen "teams"
-- und "players" heran, sondern nur ueber die Funktionen weiter unten
-- (register_team, get_team_by_code, save_team_roster). Dadurch koennen
-- z.B. nicht einfach alle E-Mail-Adressen abgegriffen werden. Admins
-- (eingeloggt via Supabase Auth) duerfen die Tabellen direkt lesen und
-- die Einstellungen direkt bearbeiten.

alter table settings enable row level security;
alter table teams enable row level security;
alter table players enable row level security;

drop policy if exists "settings_public_read" on settings;
create policy "settings_public_read" on settings
  for select using (true);

drop policy if exists "settings_admin_write" on settings;
create policy "settings_admin_write" on settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "teams_admin_read" on teams;
create policy "teams_admin_read" on teams
  for select using (auth.role() = 'authenticated');

drop policy if exists "teams_admin_write" on teams;
create policy "teams_admin_write" on teams
  for update using (auth.role() = 'authenticated');

drop policy if exists "players_admin_read" on players;
create policy "players_admin_read" on players
  for select using (auth.role() = 'authenticated');

drop policy if exists "players_admin_write" on players;
create policy "players_admin_write" on players
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- Oeffentliche Statistik (fuer die Startseite: "X / Y Teams")
-- ------------------------------------------------------------

create or replace function get_public_stats()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'team_count', (select count(*) from teams where status = 'active')
  );
$$;

grant execute on function get_public_stats to anon;

-- ------------------------------------------------------------
-- Neues Team registrieren (liefert den Zugangscode zurueck)
-- ------------------------------------------------------------

create or replace function register_team(
  p_name text,
  p_captain_name text,
  p_captain_email text,
  p_captain_phone text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings settings%rowtype;
  v_count int;
  v_code text;
begin
  select * into v_settings from settings where id = 1;
  if v_settings is null then
    raise exception 'ERR_NOT_CONFIGURED';
  end if;

  if now()::date > v_settings.registration_deadline then
    raise exception 'ERR_REGISTRATION_CLOSED';
  end if;

  select count(*) into v_count from teams where status = 'active';
  if v_count >= v_settings.max_teams then
    raise exception 'ERR_TEAM_FULL';
  end if;

  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'ERR_NAME_REQUIRED';
  end if;
  if p_captain_email is null or position('@' in p_captain_email) = 0 then
    raise exception 'ERR_INVALID_EMAIL';
  end if;

  loop
    v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    exit when not exists (select 1 from teams where access_code = v_code);
  end loop;

  insert into teams (name, access_code, captain_name, captain_email, captain_phone)
  values (trim(p_name), v_code, p_captain_name, p_captain_email, p_captain_phone);

  return v_code;
end;
$$;

grant execute on function register_team to anon;

-- ------------------------------------------------------------
-- Team + Spieler anhand des Zugangscodes abrufen
-- ------------------------------------------------------------

create or replace function get_team_by_code(p_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team teams%rowtype;
  v_players json;
begin
  select * into v_team from teams
  where access_code = upper(p_code) and status = 'active';

  if v_team is null then
    raise exception 'ERR_TEAM_NOT_FOUND';
  end if;

  select coalesce(json_agg(p order by p.created_at), '[]'::json) into v_players
  from players p where p.team_id = v_team.id;

  return json_build_object(
    'team', row_to_json(v_team),
    'players', v_players
  );
end;
$$;

grant execute on function get_team_by_code to anon;

-- ------------------------------------------------------------
-- Teamnamen + komplette Aufstellung speichern
-- p_players ist ein JSON-Array, Reihenfolge zaehlt (bestimmt die Position!):
-- [{"firstName":"Max","lastName":"Muster","gender":"m",
--   "type":"player","email":"...","mobile":"...","shirtSize":"L"}, ...]
-- Herren-Eintraege bekommen der Reihe nach M1, M2, M3, M4, M5, ...
-- Damen-Eintraege bekommen der Reihe nach W1, W2, W3, ...
-- Die ersten 4 Herren / 2 Damen sind die Pflichtpositionen, alles danach
-- sind automatisch Ersatzspieler. Mindestens 4 Herren + 2 Damen sind Pflicht.
-- p_admin=true (nur wirksam wenn wirklich als Admin eingeloggt) ignoriert
-- die Bearbeitungsfrist, damit Admins Teams jederzeit korrigieren koennen.
-- ------------------------------------------------------------

-- Falls aus einer frueheren Version bereits eine 3-Parameter-Version dieser
-- Funktion existiert, muss sie explizit geloescht werden - sonst behandelt
-- Postgres die alte und die neue (4 Parameter) als zwei ueberladene Funktionen
-- und "create or replace" alleine reicht nicht.
drop function if exists save_team_roster(text, text, jsonb);

create or replace function save_team_roster(
  p_code text,
  p_name text,
  p_players jsonb,
  p_admin boolean default false
) returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team teams%rowtype;
  v_settings settings%rowtype;
  v_men int;
  v_women int;
  v_elem jsonb;
  v_gender text;
  v_type text;
  v_position text;
  v_m_counter int := 0;
  v_w_counter int := 0;
  v_is_admin boolean;
begin
  -- auth.role() basiert auf dem JWT des Aufrufers und laesst sich vom
  -- Client nicht faelschen, egal was p_admin behauptet.
  v_is_admin := p_admin and auth.role() = 'authenticated';

  select * into v_settings from settings where id = 1;
  select * into v_team from teams
  where access_code = upper(p_code) and status = 'active';

  if v_team is null then
    raise exception 'ERR_TEAM_NOT_FOUND';
  end if;
  if not v_is_admin and now()::date > v_settings.edit_deadline then
    raise exception 'ERR_EDIT_DEADLINE_PASSED';
  end if;

  select
    count(*) filter (where (elem->>'type') = 'player' and (elem->>'gender') = 'm'),
    count(*) filter (where (elem->>'type') = 'player' and (elem->>'gender') = 'w')
  into v_men, v_women
  from jsonb_array_elements(p_players) as elem;

  if coalesce(v_men, 0) < 4 then
    raise exception 'ERR_MIN_MEN|%', coalesce(v_men, 0);
  end if;
  if coalesce(v_women, 0) < 2 then
    raise exception 'ERR_MIN_WOMEN|%', coalesce(v_women, 0);
  end if;

  update teams set name = trim(p_name), updated_at = now() where id = v_team.id;
  delete from players where team_id = v_team.id;

  for v_elem in select * from jsonb_array_elements(p_players)
  loop
    v_type := coalesce(v_elem->>'type', 'player');
    v_gender := nullif(v_elem->>'gender', '');

    if v_type = 'supporter' then
      v_position := 'Supporter';
    elsif v_gender = 'm' then
      v_m_counter := v_m_counter + 1;
      v_position := 'M' || v_m_counter;
    elsif v_gender = 'w' then
      v_w_counter := v_w_counter + 1;
      v_position := 'W' || v_w_counter;
    else
      v_position := null;
    end if;

    insert into players (team_id, first_name, last_name, gender, type, position, email, mobile, shirt_size)
    values (
      v_team.id,
      v_elem->>'firstName',
      v_elem->>'lastName',
      v_gender,
      v_type,
      v_position,
      v_elem->>'email',
      v_elem->>'mobile',
      v_elem->>'shirtSize'
    );
  end loop;

  return get_team_by_code(p_code);
end;
$$;

grant execute on function save_team_roster to anon;

-- ------------------------------------------------------------
-- Erste Einstellungen anlegen (Beispielwerte - danach im
-- Admin-Bereich unter "Einstellungen" anpassen)
-- ------------------------------------------------------------

insert into settings (id, tournament_name, event_start_date, event_end_date, registration_deadline, edit_deadline)
values (1, 'Squash Junkies', current_date + 60, current_date + 61, current_date + 30, current_date + 45)
on conflict (id) do nothing;
