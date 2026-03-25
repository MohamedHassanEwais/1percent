# 🚀 Project Blueprint: 1 Percent (Language Learning App)

## 1. Project Overview & Philosophy
**App Name:** 1 Percent  
**Slogan:** Better Every Day.  
**Core Concept:** A high-performance language learning app focusing on the "Oxford 3000" most frequent words using Spaced Repetition Systems (SRS).  
**Visual Metaphor:** The user's brain is a "Galaxy". Every learned word lights up a star.  
**Target:** Master 3000 words in 90 days.

---

## 2. Design System (The DNA)
**Theme:** Dark Futurism / Cyberpunk / Space.

### 🎨 Color Palette
* **Background:** `bg-black` (#000000) - *Solid Void Black*.
* **Primary (Energy):** `text-[#CCFF00]` / `bg-[#CCFF00]` - *Electric Lime*.
* **Secondary (Magic):** `text-[#7C3AED]` - *Deep Violet*.
* **Surface/Cards:** Glassmorphism (`bg-white/5` + `backdrop-blur-xl` + `border-white/10`).
* **Text:**
    * Headings: White (`#FFFFFF`).
    * Body: Slate-400 (`#94A3B8`).

### 🔠 Typography
* **Headings:** `Space Grotesk` (Bold, Futuristic).
* **Body:** `Inter` (Clean, Legible).

### ✨ UI Elements
* **Galaxy Map:** An interactive canvas of 3000 nodes representing the user's knowledge graph.
* **FIFA-Style Stats:** Gamification cards designed like RPG/Sports player cards.
* **Animations:** Smooth layout transitions using Framer Motion.

---

## 3. Tech Stack
* **Framework:** Next.js 14 (App Router).
* **Language:** TypeScript.
* **Styling:** Tailwind CSS.
* **Icons:** Lucide React.
* **Animations:** Framer Motion.
* **Backend / DB:** Firebase (Auth, Firestore).
* **State Management:** React Context or Zustand.
* **Deployment:** Vercel (PWA supported).

---

## 4. App Architecture (Sitemap)

### A. Onboarding Flow
1.  **Splash Screen:** Pulsing "1%" logo.
2.  **Walkthrough:** "Atomic Habits" philosophy explanation.
3.  **Level Assessment:** Interactive card selection (Rookie, Pro, Master).
4.  **Auth Screen:** Google/Email Login.

### B. Core Loop (The Player Experience)
5.  **Dashboard (Galaxy View):**
    * *Visual:* Zoomable galaxy of stars.
    * *HUD:* Streak counter, "Launch Rocket" button (Start Session).
6.  **Study Deck (The Session):**
    * *Flashcard Front:* Image + Audio (Active Recall).
    * *Flashcard Back:* Text + Example + IPA.
    * *Controls:* SRS Buttons (Again, Hard, Good, Easy).
7.  **Session Result:** Confetti, XP gained, "+1% Improvement".

### C. Gamification & Utility
8.  **Profile:** The "Player Card" (Stats, Rank, Share Button).
9.  **Leaderboard:** Global ranking based on XP.
10. **Paywall:** Lifetime Deal ($30) vs Monthly.
11. **Settings:** Notifications, Sound, Account.

---

## 5. Database Schema (Firestore)

### Collection: `users`
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "photoURL": "string",
  "level": "Rookie | Pro | Master",
  "xp": "number",
  "streak": "number",
  "lastStudyDate": "timestamp",
  "isPremium": "boolean",
  "createdAt": "timestamp"
}