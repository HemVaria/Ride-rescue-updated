# Ride Rescue — Knowledge Base

Last updated: 2025-09-20

Repository: [HemVaria/Ride-rescue-updated](https://github.com/HemVaria/Ride-rescue-updated)  
Live App: [Ride Rescue on Vercel](https://ride-rescue-updated.vercel.app)

## 1) Executive Summary

Ride Rescue is a Next.js-based on-demand roadside assistance platform. Drivers can request emergency services (e.g., towing, tire change, fuel delivery, battery jump) and are connected to the nearest providers. The app detects the user’s location, features a mobile-first responsive UI, and integrates authentication via Supabase and maps via Google Maps APIs.

Core value:
- Fast help during vehicle emergencies
- Simple, location-aware flows
- Clean, modern, mobile-optimized UX

Primary audiences:
- Drivers needing roadside assistance (end users)
- Service providers (mechanics, tow operators)
- Admins (future roadmap: dispatching, monitoring, analytics)

Service footprint (current copy): Gujarat, India (per app footer text).

---

## 2) Features

- Request Assistance
  - Emergency repairs
  - Fuel delivery
  - Towing
  - Battery jump start
  - Tire change
  - Lockout service
  - Winching
- Location-Aware Experience
  - Current-location detection (browser geolocation)
  - Map/places search and selection
  - Nearest provider discovery (implementation depends on data source; see Data section)
- Authentication
  - Sign in/up via modal (AuthModal)
  - Session state and sign-out via custom hooks
- Responsive UI
  - Works across mobile and desktop
  - Modern visual design with Tailwind + shadcn/ui components
- Navigational Components
  - FloatingNav for quick access to Home, Services, Dashboard, Contact
- Content Security Policy
  - Strict CSP configured in Next.js headers; whitelists Supabase and Spline.

Planned enhancements (from README):
- Real-time provider tracking
- Provider ratings and reviews
- Voice-based SOS
- Admin dashboard
- In-app notifications

---

## 3) Application Architecture

- Framework: Next.js 15 (App Router)
- Language: TypeScript + React 19
- Styling: Tailwind CSS + tailwindcss-animate
- UI Components: shadcn/ui (configured in components.json), Radix primitives, lucide icons
- Theming: next-themes with a custom ThemeProvider
- State: React hooks (custom and library)
- Authentication & Backend: Supabase (client-side usage)
- Maps & Geolocation:
  - Google Maps JavaScript API (lib/google-maps.ts)
  - Google Places Autocomplete (components/GooglePlacesAutocomplete.tsx)
  - Map renderers include GoogleMapView.tsx and MapView.tsx
  - Leaflet packages are installed; current homepage uses a Google Maps flow

Build configuration highlights (next.config.mjs):
- ESLint/TypeScript build errors ignored during production build
- Images unoptimized
- CSP headers restrict sources (see Security)

---

## 4) Directory and Key Files

High-level structure:
- app/
  - page.tsx — Landing page with services, 3D scene, CTA, and AuthModal integration
  - layout.tsx — Root layout (ThemeProvider, AuthProvider, FloatingNav, Toaster)
  - globals.css — App-level Tailwind and design tokens
  - auth/ — Route group (auth pages; contents not enumerated here)
  - services/, dashboard/, contact/ — Primary navigation routes
  - emergency/, garage/, history/, payment/, settings/, test/, vehicles/ — Additional route directories present (implementation varies)
- components/
  - auth/AuthModal.tsx — Sign in/up modal (referenced in pages)
  - EnhancedLocationPicker.tsx — Rich location selector
  - GoogleMapView.tsx — Google Maps renderer
  - GooglePlacesAutocomplete.tsx — Autocomplete input for places
  - LocationBasedServices.tsx — Location-aware services UI
  - LocationDisplay.tsx — Visualizes a chosen location (coordinates/address)
  - LocationPicker.tsx — Basic location picker
  - MapView.tsx — Alternate map component (likely Leaflet or Google wrapper)
  - google-maps-script.tsx — Google Maps script loader helper
  - theme-provider.tsx — Theming with next-themes
  - ui/ — shadcn/ui components (buttons, cards, navbar, toaster, etc.)
- hooks/
  - useAuth.ts / useAuth.tsx — Authentication context/provider + hook
  - useGoogleMaps.ts — Load/use Google Maps and related helpers
  - useLocation.ts — Geolocation permissions and coordinate retrieval
  - useServiceAreas.ts — Load/filter service areas data
  - use-mobile.tsx — Mobile device detection
  - use-toast.ts — Toasting utilities
- lib/
  - supabase.ts — Supabase client initialization and helpers
  - google-maps.ts — Google Maps API helper utilities
  - utils.ts — Misc utilities
- public/
  - area-name-address-phone.json — Static service area directory (area, name, address, phone)
  - placeholder-*.{png,svg,jpg} — Asset placeholders
- Root files
  - README.md — Overview and quickstart
  - components.json — shadcn/ui setup (aliases, css, icon lib)
  - tailwind.config.ts — Tailwind configuration and design tokens
  - postcss.config.mjs — PostCSS setup
  - tsconfig.json — TypeScript configuration
  - next.config.mjs — Next.js config (CSP, TS/ESLint opts)
  - Area-Name-Address-Phone (1).csv — CSV version of provider directory
  - package.json — Scripts and dependencies

Quick links:
- [app/page.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/app/page.tsx)
- [app/layout.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/app/layout.tsx)
- [lib/google-maps.ts](https://github.com/HemVaria/Ride-rescue-updated/blob/main/lib/google-maps.ts)
- [lib/supabase.ts](https://github.com/HemVaria/Ride-rescue-updated/blob/main/lib/supabase.ts)
- [components/GooglePlacesAutocomplete.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/components/GooglePlacesAutocomplete.tsx)
- [components/GoogleMapView.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/components/GoogleMapView.tsx)
- [components/LocationBasedServices.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/components/LocationBasedServices.tsx)
- [hooks/useLocation.ts](https://github.com/HemVaria/Ride-rescue-updated/blob/main/hooks/useLocation.ts)
- [hooks/useServiceAreas.ts](https://github.com/HemVaria/Ride-rescue-updated/blob/main/hooks/useServiceAreas.ts)
- [public/area-name-address-phone.json](https://github.com/HemVaria/Ride-rescue-updated/blob/main/public/area-name-address-phone.json)
- [next.config.mjs](https://github.com/HemVaria/Ride-rescue-updated/blob/main/next.config.mjs)
- [tailwind.config.ts](https://github.com/HemVaria/Ride-rescue-updated/blob/main/tailwind.config.ts)

---

## 5) Key User Flows

1. Discover and Learn
   - User lands on Home (/)
   - Reads feature highlights and services
   - Optionally explores the 3D hero scene (embedded via Spline)

2. Sign Up / Sign In
   - Click “Get Started” or “Sign In” to open AuthModal
   - Auth handled by Supabase (email/password or providers if enabled)
   - Session stored client-side; UI updates with user state from useAuth

3. Set Location and Request Service
   - Share current location via browser permissions (useLocation hook)
   - Choose service type (card grid on Home or in Services page)
   - Optionally search locations via Places Autocomplete
   - Map view displays selection; app associates nearest provider(s)

4. Dashboard
   - After authentication, “Go to Dashboard” directs to /dashboard
   - Manage profile, vehicles, past requests (feature depth depends on current page implementations)
   - Future roadmap: live tracking, chat, status updates

5. Contact and Support
   - /contact page lists support info; footer includes contact numbers and location

---

## 6) Data and Integrations

- Supabase
  - Used for auth (and likely data persistence for requests, users, vehicles)
  - Client initialized in lib/supabase.ts
  - CSP whitelist includes your Supabase project host: fwtgultjefshvdfnpipw.supabase.co

- Google Maps Platform
  - Maps JS API and Places Autocomplete via lib/google-maps.ts and components/google-maps-script.tsx
  - Geocoding/places search for address-to-coordinates and reverse
  - Map components: GoogleMapView.tsx; alternate MapView.tsx also exists

- Static Provider Directory
  - public/area-name-address-phone.json — an embedded list of providers
  - Root CSV “Area-Name-Address-Phone (1).csv” — spreadsheet source
  - Typical fields: area, name, address, phone (confirm by inspecting the JSON)

- UI/Design System
  - shadcn/ui (configured in components.json with aliases)
  - Tailwind design tokens defined in app/globals.css and tailwind.config.ts
  - lucide-react for icons

---

## 7) Environment and Configuration

Minimum required environment variables (from README and code patterns):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- Google Maps API key (check lib/google-maps.ts or google-maps-script.tsx for the exact variable name; common patterns:
  - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  - NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID (optional if using Styled Maps)
)

Local development:
```bash
npm install
npm run dev
# app at http://localhost:3000
```

Build/Start:
```bash
npm run build
npm start
```

Deployment:
- Hosted on Vercel per README
- Images unoptimized in Next config
- TypeScript and ESLint build errors are ignored (potentially mask issues; tighten for production readiness)

---

## 8) Security, Privacy, and Compliance

- Content Security Policy (next.config.mjs)
  - default-src 'self'
  - script-src 'self' 'unsafe-eval' 'unsafe-inline' (note: loosened for dev features; consider hardening)
  - style-src 'self' 'unsafe-inline'
  - img-src 'self' data: blob:
  - connect-src 'self' https://fwtgultjefshvdfnpipw.supabase.co
  - frame-src 'self' https://fwtgultjefshvdfnpipw.supabase.co https://my.spline.design
  - object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'
  - upgrade-insecure-requests
- Geolocation
  - Requires explicit user consent; ensure clear prompts and fallback UX
- PII
  - If collecting names, phone numbers, addresses, manage according to privacy policy and regional laws
- API keys
  - Never check in secrets. Only NEXT_PUBLIC_* keys are exposed client-side intentionally

---

## 9) Known Limitations and TODOs

- Build ignores TS/ESLint errors; may hide defects
- Real-time dispatching, tracking, and notifications not yet implemented
- Provider directory is currently static (JSON/CSV); dynamic discovery/matching logic may be limited
- Dual map stacks appear installed (Leaflet and Google Maps). Prefer one for consistency and maintenance
- Comprehensive error handling across location permissions, map script loading, and auth flows should be reviewed

---

## 10) FAQ (for Chatbot Training)

Q: What is Ride Rescue?  
A: An on-demand roadside assistance web app to request emergency vehicle services like towing, tire change, fuel delivery, battery jump, and more.

Q: Which regions do you serve?  
A: The app copy references Gujarat, India; service coverage may expand over time.

Q: How do I request help?  
A: Open the app, allow location access, choose a service, and confirm your location. The app connects you to nearby providers.

Q: Do I need an account?  
A: You can browse without signing in, but creating an account helps track requests and access the dashboard.

Q: How is my location used?  
A: With your consent, your browser shares your coordinates to find nearby providers and show accurate maps.

Q: What services are available?  
A: Emergency repairs, towing, fuel delivery, tire change, battery jump start, lockout service, winching.

Q: Is there a mobile app?  
A: It’s a responsive web app optimized for mobile browsers.

Q: How do I contact support?  
A: Use the Contact page. The footer lists support info (e.g., +91 8200487838).

Q: What maps are used?  
A: Google Maps and Places Autocomplete are integrated. A Leaflet-based component also exists in the codebase.

Q: Is my data secure?  
A: The app uses Supabase for authentication and applies a strict Content Security Policy. Do not share sensitive info in chat unless necessary.

---

## 11) Troubleshooting (for Chatbot Training)

- Map not loading
  - Ensure your Google Maps API key is set (NEXT_PUBLIC_*), correct billing, and correct referrer restrictions
  - Check console for script or CSP errors; verify next.config.mjs headers
- Location not detected
  - Allow location permissions in your browser
  - Check that useLocation error states are handled (fallback to manual search)
- Authentication issues
  - Verify Supabase URL/key in env
  - Confirm network calls to your Supabase project are allowed by CSP
- Styling or layout broken
  - Ensure Tailwind compiled successfully, class names intact
  - Verify app/globals.css is included and theme-provider wraps the app
- “Build succeeded but app crashes”
  - TypeScript/ESLint errors might be ignored at build time; run npm run lint and fix errors locally

---

## 12) Chatbot Knowledge Nuggets (atomic facts)

- App name: “Ride Rescue”
- Purpose: On-demand roadside assistance
- Core services: towing, tire change, fuel delivery, battery jump, lockout, winching
- Auth: Supabase; modal-based sign in/up; useAuth hook
- Maps: Google Maps + Places; geolocation prompt; LocationPicker and Autocomplete components
- Static provider directory: public/area-name-address-phone.json (+ CSV)
- UI libraries: Tailwind, shadcn/ui, Radix, lucide
- Theming: next-themes via ThemeProvider
- Routes present: /, /services, /dashboard, /contact (+ emergency, garage, history, payment, settings, test, vehicles)
- Security: Strict CSP configured; Supabase and Spline domains whitelisted
- Deployment: Vercel
- Region reference in UI: Gujarat, India
- Live URL: https://ride-rescue-updated.vercel.app

---

## 13) Suggested Intents and Responses (for Chatbot)

- “What is Ride Rescue?” → Return Executive Summary
- “How do I request a tow?” → Explain flow (location + select towing + confirm)
- “Do you serve my city?” → Ask for city; check against service areas JSON; reply if listed, otherwise suggest manual contact
- “I can’t share my location.” → Provide manual address entry instructions and permission steps
- “How do I sign in?” → Explain AuthModal flow; link to “Get Started” on Home page
- “Is my data safe?” → Summarize CSP and auth; no storage of secrets client-side
- “Which services do you offer?” → Return list from Features section
- “How can I contact support?” → Provide Contact page info and phone number from footer
- “Why is the map blank?” → Troubleshooting steps for maps (API key, CSP, billing)
- “Where can I see my past requests?” → Direct to /dashboard (subject to implementation)

---

## 14) References to Code (for maintainers and chatbot)

- Landing Page: [app/page.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/app/page.tsx)
- Root Layout: [app/layout.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/app/layout.tsx)
- Auth Provider/Hook: [hooks/useAuth.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/hooks/useAuth.tsx) and/or [hooks/useAuth.ts](https://github.com/HemVaria/Ride-rescue-updated/blob/main/hooks/useAuth.ts)
- Auth Modal: components/auth/AuthModal.tsx (referenced by pages)
- Geolocation: [hooks/useLocation.ts](https://github.com/HemVaria/Ride-rescue-updated/blob/main/hooks/useLocation.ts)
- Google Maps helpers: [lib/google-maps.ts](https://github.com/HemVaria/Ride-rescue-updated/blob/main/lib/google-maps.ts)
- Google Places Autocomplete: [components/GooglePlacesAutocomplete.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/components/GooglePlacesAutocomplete.tsx)
- Map views: [components/GoogleMapView.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/components/GoogleMapView.tsx), [components/MapView.tsx](https://github.com/HemVaria/Ride-rescue-updated/blob/main/components/MapView.tsx)
- Static providers: [public/area-name-address-phone.json](https://github.com/HemVaria/Ride-rescue-updated/blob/main/public/area-name-address-phone.json)
- CSP and Next config: [next.config.mjs](https://github.com/HemVaria/Ride-rescue-updated/blob/main/next.config.mjs)
- Tailwind config: [tailwind.config.ts](https://github.com/HemVaria/Ride-rescue-updated/blob/main/tailwind.config.ts)
- UI config: [components.json](https://github.com/HemVaria/Ride-rescue-updated/blob/main/components.json)

---

## 15) Roadmap Suggestions

- Replace static provider directory with a database table and admin tooling
- Add request lifecycle: create → assign → en route → arrived → completed
- Live tracking with driver/provider apps or roles
- Notifications (email/SMS/push) via a queue
- Payments integration on /payment
- Harden CSP (reduce unsafe-*), remove TS/ESLint ignore in prod
- Consolidate map stack (choose Google or Leaflet) and remove unused deps

---

## 16) Glossary

- Provider: A service partner who delivers roadside assistance
- Service area: Geographic area served, often city/region-based
- Geocoding: Translating addresses ↔ coordinates
- Places Autocomplete: Google API offering address predictions while typing
- CSP: Content Security Policy (HTTP headers controlling resource loads)