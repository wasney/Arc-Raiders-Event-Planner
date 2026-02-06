RAIDER // SIGNAL
Tactical Coordination Suite for Arc Raiders

RAIDER // SIGNAL is a "Command & Control" dashboard designed to help gaming guilds coordinate missions, manage rosters, and synchronize raid times across global time zones.

It functions as a Progressive Web App (PWA), meaning it can be installed natively on desktop and mobile devices for an immersive, full-screen experience without requiring an app store download.
📱 Field Deployment (PWA)

This tool is Install-Ready. It utilizes a Service Worker with a "Network First" strategy to ensure operators always see live roster data while maintaining app-like performance.

    Desktop (Chrome/Edge): Look for the Install Icon ( ⊕ ) in the right side of the address bar.

    Mobile (iOS): Tap Share → Add to Home Screen.

    Mobile (Android): Tap Menu (⋮) → Install App or Add to Home Screen.

Once installed, RAIDER // SIGNAL launches in a standalone window, removing browser UI elements for a dedicated tactical interface.
📡 Core Capabilities

    Secure Uplink (Auth): Users authenticate via Discord OAuth2.

    The Gatekeeper: An automated security protocol that scans the user's Discord server list. Access is strictly denied unless the user is a verified member of the target Guild.

    Global Chronometer: Automatic time zone normalization. A user in Tokyo sees mission times in JST, while a user in New York sees the same mission in EST.

    Tactical Roster: A filtered database of agents, searchable by Region (NA/EU/Global), Playstyle (PvP/PvE), and Active Status.

    Mission Board: Create, edit, and join raids. Includes countdown timers and "Add to Calendar" (.ics/Google) integration.

    Command Center: A hidden administrative dashboard for managing personnel, approving new recruits, and discharging agents.

🛠️ Tech Stack & Services

This project utilizes a "Serverless" architecture, running entirely in the browser while leveraging powerful APIs for backend logic.

    Frontend: Vanilla JavaScript (ES6+), HTML5, CSS3.

        PWA: manifest.json & sw.js for native installation and asset caching.

        Design: High-contrast, cyberpunk terminal aesthetic with scanline effects.

    Database & Auth: Supabase (PostgreSQL).

        Handles user sessions, profile storage, and event management.

        Security is enforced via Row Level Security (RLS) policies.

    Authentication Provider: Discord.

        Used for identity verification and avatar retrieval.

    Time Management: Day.js.

        Handles complex UTC conversions and relative time formatting.

🔒 Security Model

This tool operates on a "Trust No One" (Zero Trust) database model:

    Public Client: The website source code contains public configuration keys (Supabase Anon Key, Discord Client ID). These are safe to expose.

    Database Gates (RLS): Actual data access is controlled by the PostgreSQL database engine.

        Unverified Users: Can only read/write their own onboarding data.

        Verified Agents: Can read the roster and event board.

        Admins: Have full modification rights.

    Verification Loop: Upon login, the client validates the user's Discord Guild membership. If the user leaves the Discord server, their access to this tool is revoked automatically upon their next session refresh.

🚀 Deployment

This project is designed to be hosted on GitHub Pages or any static hosting service (Vercel, Netlify).

    Clone the repository.

    Ensure index.html, manifest.json, sw.js, and the icon files (icon-192.png, icon-512.png) are in the root directory.

    Update the REQUIRED_GUILD_ID in index.html to your Discord Server ID.

    Configure your Supabase URL and Key.

    Deploy.

Disclaimer: This is a fan-made tool for community organization and is not affiliated with Embark Studios.
