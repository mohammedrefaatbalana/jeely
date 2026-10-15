# Jeely (جِيلِي) Mobile Application

## Overview

**Jeely** is a community service directory for Nubian artisans and professionals built with **Expo, React Native, TypeScript, and Firebase**. The app mirrors the visual design of the web version (`https://jeely-app.vercel.app`) and implements the functional requirements extracted from the Meta AI conversation.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Firebase Configuration](#firebase-configuration)
- [Running the App](#running-the-app)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Key Features](#key-features)
- [Known Limitations](#known-limitations)

---

## Prerequisites

- **Node.js** (>= 22 – the version used in the repo is 22.21.0)
- **npm** (>= 10) – you can also use **bun** if a `bun.lock` file is present.
- **Expo CLI** (`npm i -g expo-cli`)
- **Android Studio** or **Xcode** for running on simulators/emulators (optional – Expo Go works for most features).
- A **Firebase project** (see below).

## Project Setup

```bash
# Clone the repository (if you have it locally, skip this)
git clone <repo-url> jeely
cd jeely

# Install dependencies
npm install
# If you prefer bun and a bun.lock exists:
# bun i
```

## Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com.
2. Enable **Authentication** → Phone sign‑in.
3. Create a **Firestore** database (production mode).
4. (Optional) Enable **Storage** for provider images.
5. Add a **web app** in the project settings to obtain the config values.
6. Copy `.env.example` to `.env.local` and fill in the values:
   ```dotenv
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
7. Deploy the security rules:
   ```bash
   npx firebase-tools@latest deploy --only firestore:rules,storage:rules
   ```
   (Make sure the `firebase-tools` CLI is installed globally or use `npx`.)

## Running the App

```bash
# Start the Expo dev server (default Android/iOS/web)
npx expo start
```
- Press `w` to open in a web browser.
- Scan the QR code with the Expo Go app on your device.
- For native modules (e.g., image picker) you need a **development build**:
  ```bash
  npx expo run:ios   # iOS development build
  npx expo run:android   # Android development build
  ```

## Building for Production

We use **EAS Build**:
```bash
# Install EAS CLI (bun or npm)
bunx eas-cli@latest login   # or npx eas-cli@latest login
# Create a development build first to test native modules
bunx eas-cli@latest build --profile development
# When ready, create a production build
bunx eas-cli@latest build --profile production
```
Configure `eas.json` according to the Expo docs.

## Testing

- **TypeScript**: `npx tsc --noEmit`
- **Linting**: `npx expo lint`
- **Manual UI tests**: navigate through all tabs, create a provider, book an appointment, write a review, send a chat message, and file a complaint.
- **Firebase rules**: try to read/write unauthorized data to verify the rules block access.

## Folder Structure
```
app/                     # Expo Router screens & layouts
  +not-found.tsx        # 404 fallback
  (tabs)/                # Bottom‑tab layout and screens
src/
  components/           # Reusable UI components (Header, Card, Modals…)
  context/              # React contexts (Auth, Sector, Favorites, Appointments)
  constants/            # Theme colors, border radii, static data, etc.
  services/             # Firebase initialisation & data‑access layer
  hooks/                # Custom reusable hooks
  types/                # TypeScript interfaces
  utils/                # Helper functions
assets/                  # Images, fonts, SVGs
```

## Key Features
- **Sector switching** between craftsmen and professionals.
- **Provider directory** with search, filter by profession/village, and quick‑chip filters.
- **Provider profile** with gallery, rating, booking, and chat.
- **Favorites** and **appointments** management.
- **Auth flow** using phone number (SMS) verification.
- **Admin portal** (password `nubi2026`) for approving providers and managing content.
- **Safety & complaints** screen with contract agreement.
- **RTL support** for Arabic UI.
- **Offline‑first** sync using AsyncStorage + Firestore listeners.

## Known Limitations
- Push notifications are not yet wired (requires `expo-notifications` and server‑side trigger).
- PWA manifest is not generated automatically – you can run `expo export:web` to get static assets.
- The admin portal lives inside the *Safety* screen; a dedicated admin screen can be added later.
- Storage rules are permissive for development – tighten before production.

---

Happy coding! 🚀
