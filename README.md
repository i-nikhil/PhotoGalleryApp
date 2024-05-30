# PhotoGalleryApp
PhotoGalleryApp is an Apache Cordova application that allows users to take photos, save them, and view them in a gallery format. This app is designed for Android devices.

<img src="https://github.com/i-nikhil/PhotoGalleryApp/assets/66352372/f3e50e21-ffae-46ec-8d45-9f3904cbc7b5" alt="screenshot" width="200">

## Features

- Take photos using the device's camera.
- Save photos to a local gallery.
- View photos in a gallery with a thumbnail preview.

## Prerequisites

- Node.js and npm installed.
- Apache Cordova installed globally (`npm install -g cordova`).
- Android SDK installed and configured.
- Gradle installed and configured (if not using the Gradle wrapper).

## Installation

1. **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd PhotoGalleryApp
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Add the Android Platform**:
    ```bash
    cordova platform add android
    ```

4. **Add Required Plugins**:
    ```bash
    cordova plugin add cordova-plugin-camera
    cordova plugin add cordova-plugin-file
    ```
    
5. **Generate APK file**:
    ```bash
    cordova build android
    ```
    
6. **Cleanup and reload android platform in case of Exception
    ```bash
    cordova clean
    cordova platform remove android
    cordova platform add android
    cordova build android
    ```
