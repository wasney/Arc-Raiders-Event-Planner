# RAIDER // SIGNAL
### Tactical Coordination Suite for Arc Raiders

**RAIDER // SIGNAL** is a "Command & Control" dashboard designed to help gaming guilds coordinate missions, manage rosters, and synchronize raid times across global time zones.

It functions as a **Progressive Web App (PWA)**, offering a native app-like experience on mobile and desktop with offline caching and "Install to Home Screen" capabilities.

## 📡 Core Capabilities

* **Secure Uplink (Auth):** Users authenticate via **Discord OAuth2**.
* **Chain of Command (Ranks):**
    * 👑 **Commander:** Full system access. Can configure webhooks, auto-approve settings, and promote/demote anyone.
    * 🛡️ **Field Officer:** Can approve recruits, delete spam missions, and manage Soldiers. Cannot access system configs.
    * ⚔️ **Soldier:** Standard operator. Can join/create missions and manage their schedule.
* **The Headhunter (Auto-Match):** When a mission is created, the system calculates which operators are available (converting UTC to local time) and pushes internal **Tactical Alerts** to their dashboard.
* **Comms Array (Webhooks):** Dynamic routing for Discord alerts.
    * *General:* Mission briefings.
    * *Admin:* Recruit notifications.
    * *Debug:* System logs.
* **Tactical Forecaster:** "Time Machine" lookup allows officers to check squad availability for future dates/times.

## 📱 Field Deployment (PWA)

This tool is **Install-Ready**. It utilizes a Service Worker with a "Network First" strategy.

* **Desktop:** Look for the **Install Icon** ( ⊕ ) in the address bar.
* **Mobile (iOS/Android):** Tap **Share** → **Add to Home Screen**.

## 🛠️ Tech Stack & Architecture

* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3. (No build steps required).
* **Backend:** **[Supabase](https://supabase.com/)** (PostgreSQL).
* **Integrations:** Discord OAuth2 & Webhooks.

## 🗄️ Database Schema (Required)

To deploy this yourself, run these SQL commands in your Supabase SQL Editor.

### 1. PROFILES (User Data & Ranks)
```sql
create table profiles (
  id uuid references auth.users primary key,
  discord_name text,
  avatar_url text,
  region text,
  play_style text,
  timezone text,
  embark_id text,
  status text default 'pending', -- 'verified', 'pending'
  rank text default 'soldier',   -- 'commander', 'officer', 'soldier'
  notify_on_match boolean default true,
  availability_json jsonb,
  created_at timestamp with time zone default now()
);
```

### 2. EVENTS (Missions)
```sql
create table events (
  id uuid default uuid_generate_v4() primary key,
  title text,
  description text,
  start_time timestamp with time zone,
  region text,
  timezone text,
  mission_type text,
  conditions text[],
  host_id uuid references profiles(id),
  created_at timestamp with time zone default now()
);
```

### 3. SIGNUPS (Attendance)
```sql
create table event_signups (
  event_id uuid references events(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (event_id, user_id)
);
```

### 4. NOTIFICATIONS (Headhunter System)
```sql
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  message text,
  action_link text,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);
```

### 5. WEBHOOK ENDPOINTS (Comms Array)
```sql
create table webhook_endpoints (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  url text not null,
  type text not null, -- 'general', 'admin', 'debug'
  is_active boolean default true,
  created_at timestamp with time zone default now()
);
```

### 6. APP CONFIG (Global Settings)
```sql
create table app_config (
  key text primary key,
  value text
);

-- Default Settings
insert into app_config (key, value) values
  ('required_guild_id', 'YOUR_DISCORD_SERVER_ID'),
  ('auto_approve', 'false');
```

## 🔒 Security Policies (RLS)

You must enable Row Level Security (RLS) on all tables.

* **Profiles:** Everyone can read. Only Commanders/Officers can update others (to approve/promote). Users can update themselves.
* **Events:** Everyone can read. Commanders/Officers can delete ANY event. Hosts can delete their own.
* **Webhooks/Config:** Only Commanders can read/write.

## 🚀 Deployment

1.  **Clone the Repo:** Download the files to your machine.
2.  **Upload Icons:** Ensure `icon-192.png` and `icon-512.png` are in the root folder.
3.  **Configure Supabase:**
    * Create a project at [Supabase.com](https://supabase.com).
    * Run the SQL above.
    * Enable Discord OAuth in Supabase Authentication settings.
4.  **Connect the App:**
    * Open `index.html`.
    * Update the `CONFIG` object with your Supabase URL and Anon Key.
5.  **Launch:** Host on GitHub Pages, Netlify, or Vercel.

---
*Disclaimer: This is a fan-made tool for community organization and is not affiliated with Embark Studios.*
