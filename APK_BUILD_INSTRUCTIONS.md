# Building an APK with Expo EAS

To generate an APK for your React Native app, you will use **EAS (Expo Application Services)**.

## Prerequisites
1. Ensure you have an Expo account at [expo.dev](https://expo.dev).
2. Install EAS CLI globally if you haven't already:
   ```bash
   npm install -g eas-cli
   ```
3. Log in to your Expo account:
   ```bash
   eas login
   ```

## Step-by-Step Guide

### 1. Initialize EAS Build
Run the following command at the root of your project:
```bash
eas build:configure
```
Select `Android` and `iOS` (or just Android) when prompted. This creates an `eas.json` file in your root directory.

### 2. Configure `eas.json` for APK
By default, EAS generates an `.aab` (Android App Bundle) for Google Play. To generate an `.apk` for direct installation, modify the `preview` profile in your `eas.json` file:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

### 3. Build the APK
Run the following command to start the build on Expo's servers:
```bash
eas build -p android --profile preview
```

### 4. Download and Install
- The CLI will provide a link to the Expo dashboard where you can monitor the build progress.
- Once finished, you will receive a direct download link (or a QR code) for the APK.
- Download the APK to your Android device, allow installations from unknown sources in your device settings, and install the app.

## Connecting to a Real Backend Later
Currently, the app uses `AsyncStorage` and Context APIs (`AuthContext`, `DataContext`) to mock the backend.
To switch to a real backend (like Node.js, Firebase, or Supabase):
1. **AuthContext:** Replace the `AsyncStorage` logic in `login()` and `register()` with real API calls (e.g., `axios.post('https://api.yourdomain.com/login')`). Remove the `setTimeout` mocks. Store the JWT token securely instead of the entire user object.
2. **DataContext:** Replace the `loadData()`, `addWorkout()`, and `deleteWorkout()` methods with real REST or GraphQL fetch requests.
