# 🚀 Zenith Tracker Pro
**Premium Student Wellness & Habit Tracking Engine**

Zenith is a high-performance, mobile-first wellness application designed specifically for students. It focuses on mental clarity, physical health, and habit consistency through a clean, distraction-free interface.

---

## 📱 Proper App Conversion (APK/IPA Guide)

If you want to convert this project into a native app (like an app built in Android Studio), follow these steps:

### Method A: Professional Native Shell (Capacitor)
This method allows you to use Android Studio features.

1.  **Initialize Node Project**: Ensure you have `package.json` in the root.
2.  **Install Capacitor**:
    ```bash
    npm install @capacitor/core @capacitor/cli @capacitor/android
    ```
3.  **Build Your App**:
    Generate your `dist` folder (static files).
4.  **Add Android Platform**:
    ```bash
    npx cap init ZenithTracker com.zenith.tracker.pro --web-dir dist
    npx cap add android
    ```
5.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
6.  **Build APK**: In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

### Method B: The PWABuilder Way (Fastest)
1.  Host this code on a URL (Vercel, Netlify, or GitHub Pages).
2.  Go to **[PWABuilder.com](https://www.pwabuilder.com/)**.
3.  Enter your hosted URL.
4.  Download the **Android/Samsung** package. It will generate the `.apk` and `.aab` (Play Store) files for you automatically.

---

## ✨ Key Features
- **Daily Rituals**: Track habits with streak counters and categories.
- **Mental Health**: Log mood states and daily reflections.
- **Physical Health**: Track water intake and sleep cycles.
- **Insights**: Radar charts for life balance and trend analysis.
- **Offline First**: Works without internet via Service Workers.
- **Native UI**: Glassmorphism, dark mode, and haptic-feel interactions.

---

## 🛠 Tech Stack
- **Frontend**: React (ES6 Modules)
- **Styling**: Tailwind CSS (Native Fluid Design)
- **Charts**: Recharts
- **Native Bridge**: Capacitor
- **Storage**: LocalStorage (Persistent)
- **Environment**: PWA (Service Worker)

---

## 📁 Project Structure
- `index.html`: Main entry with native-ready meta tags.
- `App.tsx`: Navigation and state management.
- `pages/`: Core UI views (Dashboard, Wellness, Habits, etc.)
- `constants.ts`: Global configuration and initial data.
- `manifest.json`: PWA configuration for mobile installation.
- `capacitor.config.json`: Native Android/iOS project configuration.

---

## 🔧 Hardware Permissions
The app is pre-configured to request:
- ✅ Notifications (Reminders)
- ✅ Storage (Backups)
- ✅ Camera (Future avatar/journaling features)

---
*Created with ❤️ for students who want to reach their Zenith.*
