# 📍 SpotScout — React Native (Expo)

Campus library seat booking app for GEHU University.

---

## 🚀 Run on Your Phone in 3 Steps

### Step 1 — Install tools (one time only)
Open Terminal on your Mac and run:
```bash
# Install Node.js first from https://nodejs.org (download LTS version)

# Then install Expo CLI
npm install -g expo-cli
```

### Step 2 — Install app dependencies
```bash
cd SpotScout-RN
npm install
```

### Step 3 — Start the app
```bash
npx expo start
```
A QR code will appear in Terminal.

**On your Android phone:**
1. Install **Expo Go** from Play Store
2. Open Expo Go → tap "Scan QR Code"
3. Scan the QR code from your Terminal
4. App loads on your phone! 🎉

---

## 📱 Screens

| Screen | Description |
|--------|-------------|
| Onboarding | Student signup (Name, ERP, Dept, Section, Year) |
| Home | Dashboard with library cards + map preview |
| Scanner | QR code scanner — scan library entrance QR |
| My Spots | All your bookings |
| Admin | PIN-protected admin panel per library |
| Profile | Your student details |

---

## 🔐 Admin PINs

| Library | PIN |
|---------|-----|
| GEHU Central Library | 1111 |
| GEHU Law Library | 2222 |
| Santoshanad Library | 3333 |
| CSIT Block Library | 4444 |
| Chanakya Block Library | 5555 |
| **Master Admin (all)** | **1234** |

---

## 📷 QR Codes for Library Entrances

Each library has an ID. Print these as QR codes and paste at entrance:

| Library | QR Data (encode this) |
|---------|----------------------|
| GEHU Central | `gehu-central` |
| GEHU Law | `gehu-law` |
| Santoshanad | `santoshanad` |
| CSIT Block | `csit-block` |
| Chanakya | `chanakya` |

Use https://qr.io or any free QR generator to make printable QR codes.

---

## 🛠️ VSCode Setup (optional)
Install these VSCode extensions for best experience:
- **React Native Tools**
- **ES7 React/Redux Snippets**
- **Prettier**
