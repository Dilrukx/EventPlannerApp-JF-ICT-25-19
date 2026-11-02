# 📅 Event Planner

A mobile event planning app built with **React Native** and **Expo**. Plan your moments, never miss your events!

Create events with a date, time and description, set an optional reminder, and get a notification before the event starts. Events are saved on your device, so they are still there when you reopen the app.

---

## ✨ Features

- **Splash / Welcome screen** with a *Get Started* button
- **Home screen** with an event list split into **Upcoming** and **Past**
- **Add events** with name, date, time and description
- **Edit and delete events** (with a delete confirmation)
- **Search** events by name, description or date
- **Reminders**: pick a reminder time and get a local notification such as *"Starts in 30 minutes!"*
- **Offline storage**: events are saved on the device using AsyncStorage
- **Native date and time pickers**
- **Bottom tab navigation** (Home, Add, Search) and a floating **+** button

---

## 🛠️ Tech Stack

| Purpose | Library |
|---|---|
| Framework | React Native + Expo |
| Navigation | React Navigation (native stack + bottom tabs) |
| Local storage | `@react-native-async-storage/async-storage` |
| Date / time picker | `@react-native-community/datetimepicker` |
| Notifications | `expo-notifications` |
| Gradients | `expo-linear-gradient` |
| Icons | `@expo/vector-icons` |

---

## 📁 Project Structure

```
EventPlannerApp/
├── App.js                      # App entry: providers + navigation
├── app.json                    # Expo configuration
├── index.js
├── package.json
└── src/
    ├── theme.js                # Colors and shared styles
    ├── components/
    │   ├── EventCard.js        # Single event card
    │   └── PickerField.js      # Date / time picker field
    ├── context/
    │   └── EventsContext.js    # Events state + AsyncStorage (add / update / delete)
    ├── navigation/
    │   └── MainTabs.js         # Bottom tabs: Home | Add | Search
    ├── screens/
    │   ├── SplashScreen.js
    │   ├── HomeScreen.js
    │   ├── AddEditEventScreen.js   # Used for both Add and Edit
    │   └── SearchScreen.js
    └── utils/
        ├── date.js             # Date / time formatting helpers
        └── notifications.js    # Schedule and cancel reminders
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- The **Expo Go** app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)), or an Android / iOS emulator

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS). Your phone and computer must be on the same Wi-Fi network.

If the QR code doesn't connect, try tunnel mode:

```bash
npx expo start --tunnel
```

### Installing packages from scratch

If you are setting the project up in a new Expo app, install the dependencies with Expo so the versions match your SDK. On **Windows PowerShell** put the whole command on **one line**:

```powershell
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage @react-native-community/datetimepicker expo-notifications expo-linear-gradient @expo/vector-icons
```

Make sure `app.json` lists the notification plugin:

```json
"plugins": ["expo-notifications"]
```

---

## 🔔 About Notifications

Reminders use **local notifications**. When you save an event with a reminder, the app schedules a notification for the chosen reminder time. Editing or deleting the event cancels or reschedules it.

> Notification support in **Expo Go** can be limited on newer versions. For the most reliable reminders, use a development build:
>
> ```bash
> npx expo run:android
> # or
> npx expo run:ios
> ```

---

## 🧠 How It Works

- **State** lives in `EventsContext.js`, so every screen shares the same events list.
- Events are saved to the device with **AsyncStorage** whenever they change, and loaded when the app opens.
- Dates are stored as `YYYY-MM-DD` and times as `HH:mm` strings, which avoids timezone problems. They are formatted for display in `utils/date.js`.
- An event is **Upcoming** if its date and time are in the future, otherwise it is **Past**.
- **Add** and **Edit** share one screen. If an `eventId` is passed in the route params, the screen opens in edit mode.

---

## 📱 Screens

1. **Splash / Welcome**
2. **Home** (Upcoming / Past, search, floating add button)
3. **Add Event**
4. **Edit Event** (Update and Delete)
5. **Search Results**
6. **Reminder Notification**



---

## 🗺️ Future Improvements

- Dark mode
- Recurring events
- Event categories and colors
- Calendar view
- Cloud backup / sync

---

## 📄 License

This project is licensed under the terms in the [LICENSE](LICENSE) file.

---

## 🙌 Acknowledgements

Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/).
