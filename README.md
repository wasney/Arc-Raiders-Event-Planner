# RAIDER // SIGNAL
### Tactical Coordination Suite for Arc Raiders

**RAIDER // SIGNAL** is a "Command & Control" dashboard designed to help gaming guilds coordinate missions, manage rosters, and synchronize raid times across global time zones.

It functions as a **Progressive Web App (PWA)**, offering a native app-like experience on mobile and desktop with offline caching and "Install to Home Screen" capabilities.

## 📡 Core Capabilities

* **Secure Uplink (Auth):** Users authenticate via **Discord OAuth2**.
* **The Gatekeeper:** Automated security protocol. Access is denied unless the user is a verified member of the target Guild. Includes "Pending" states for admin approval.
* **Tactical Forecaster (Roster):** "Time Machine" lookup allows admins to check squad availability for future dates/times across all time zones.
* **The Headhunter (Auto-Match):** When a mission is scheduled, the system automatically identifies available agents and pushes internal **Tactical Alerts** to their dashboard.
* **Mission Board:** Create, edit, and join raids. Includes countdown timers, conditions, and ".ics/Google Calendar" export.
* **Command Center:** A hidden administrative dashboard for managing personnel, approving recruits, and configuring system settings (Webhooks, Auto-Approve) without touching code.

## 📱 Field Deployment (PWA)

This tool is **Install-Ready**. It utilizes a Service Worker with a "Network First" strategy to ensure operators always see live data.

* **Desktop:** Look for the **Install Icon** ( ⊕ ) in the address bar.
* **Mobile (iOS/Android):** Tap **Share** → **Add to Home Screen**.
* **Mobile Optimized:** Features a horizontal-scroll navigation bar and touch-optimized tooltips.

## 🛠️ Tech Stack & Architecture

* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
    * *No Build Steps:* Runs directly in the browser.
* **Backend:** **[Supabase](https://supabase.com/)** (PostgreSQL).
    * Handles Auth, Database, and Real-time subscriptions.
* **Integrations:**
    * **Discord Webhooks:** Broadcasts mission briefings to public channels and "Pending Recruit" alerts to private admin channels.

## 🗄️ Database Schema (Required)

To deploy this yourself, run these SQL commands in your Supabase SQL Editor to set up the required tables:

```sql

-- 1. PROFILES (User Data)
create table profiles (
  id uuid references auth.users primary key,
  discord_name text,
  avatar_url text,
  region text,
  play_style text,
  timezone text,
  embark_id text,
  status text default 'pending', -- 'verified', 'pending'
  is_admin boolean default false,
  notify_on_match boolean default true,
  availability_json jsonb,
  created_at timestamp with time zone default now()
);

-- 2. EVENTS (Missions)
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

-- 3. SIGNUPS (Attendance)
create table event_signups (
  event_id uuid references events(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (event_id, user_id)
);

-- 4. NOTIFICATIONS (Headhunter System)
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  message text,
  action_link text,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- 5. APP CONFIG (Dynamic Settings)
create table app_config (
  key text primary key,
  value text
);

-- 6. DEFAULT SETTINGS (Update these in the Admin Dashboard later)
insert into app_config (key, value) values
  ('required_guild_id', 'YOUR_DISCORD_SERVER_ID'),
  ('discord_webhook_url', ''),
  ('admin_webhook_url', ''),
  ('auto_approve', 'false');
