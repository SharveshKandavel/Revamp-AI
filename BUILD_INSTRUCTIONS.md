# Mobile App Build Instructions

This document provides step-by-step instructions to build and publish the Revamp AI PC Builder mobile app to the Google Play Store.

## Prerequisites

1. **Google Play Developer Account** ($25 one-time fee)
   - Go to [Google Play Console](https://play.google.com/console)
   - Create a developer account
   - Complete the verification process

2. **Android Studio** (for building and testing)
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK and build tools
   - Set up Android emulator or physical device

3. **Java Development Kit (JDK) 17+**
   - Required for Android development

## Development Setup

### Phase 1: Initial Setup
```bash
# 1. Clone the repository locally
git clone [your-github-repo-url]
cd [project-directory]

# 3. Install dependencies
npm install

# 4. Initialize Capacitor (already done in this project)
# npx cap init (already configured)

# 5. Build the web app
npm run build

# 6. Add Android platform
npx cap add android

# 7. Copy web assets to native project
npx cap sync android
```

### Phase 2: Android Configuration

1. **Update Android App Configuration**
   ```bash
   # Open Android project in Android Studio
   npx cap open android
   ```

2. **Configure App Signing (Required for Play Store)**
   - In Android Studio: Build → Generate Signed Bundle/APK
   - Create new keystore or use existing one
   - Save keystore credentials securely (you'll need them for updates)

3. **Update App Icons and Resources**
   - Replace default icons in `android/app/src/main/res/` directories
   - Update splash screen resources
   - Ensure all required icon sizes are present

### Phase 3: Building for Production

1. **Build Release Version**
   ```bash
   # Build web app for production
   npm run build
   
   # Sync with native project
   npx cap sync android
   
   # Open in Android Studio
   npx cap open android
   ```

2. **Generate Signed App Bundle (AAB)**
   - In Android Studio: Build → Generate Signed Bundle/APK
   - Select "Android App Bundle"
   - Choose your keystore and provide credentials
   - Select "release" build variant
   - Generate the AAB file

### Phase 4: Google Play Store Setup

1. **Create App Listing**
   - Go to Google Play Console
   - Create new application
   - Fill in app details:
     - App name: "Revamp AI PC Builder"
     - Short description: "Build your dream PC with AI recommendations"
     - Full description: [Use detailed description from manifest]
     - Category: "Tools" or "Productivity"

2. **Upload Assets**
   - App icon: 512x512px (use generated app-icon-512.png)
   - Feature graphic: 1024x500px (use generated play-store-feature.png)
   - Screenshots: Multiple phone and tablet screenshots
   - Short description: Max 80 characters
   - Full description: Max 4000 characters

3. **Content Rating**
   - Complete content rating questionnaire
   - Most likely rated "Everyone" or "Teen"

4. **Target Audience**
   - Select appropriate age groups
   - Configure family policy settings if applicable

### Phase 5: Publishing

1. **Internal Testing** (Optional but recommended)
   - Upload AAB to Internal testing track
   - Test with small group of users
   - Gather feedback and fix issues

2. **Production Release**
   - Upload final AAB to Production track
   - Complete store listing review
   - Set pricing (Free in this case)
   - Select countries for distribution
   - Submit for review

3. **Review Process**
   - Google typically reviews apps within 7 days
   - You'll receive email notification when approved
   - App will be live on Play Store after approval

## Important Files and Configurations

### Key Configuration Files
- `capacitor.config.ts` - Capacitor configuration
- `android/app/src/main/AndroidManifest.xml` - Android app manifest
- `android/app/src/main/res/values/strings.xml` - App strings
- `public/manifest.json` - PWA manifest for web features

### App Assets
- App Icon: `src/assets/app-icon-512.png`
- Splash Screen: `src/assets/splash-screen.png`
- Feature Graphic: `src/assets/play-store-feature.png`

### Mobile-Optimized Components
- `src/components/mobile/MobileOptimizedHeader.tsx`
- `src/components/mobile/TouchOptimizedButton.tsx`
- `src/components/mobile/MobileOptimized3D.tsx`
- `src/hooks/useMobile.ts`

## Testing Checklist

Before submitting to Play Store, ensure:

- [ ] App launches successfully on Android device
- [ ] All features work on mobile (touch interactions, 3D visualization, etc.)
- [ ] App handles different screen sizes and orientations
- [ ] No crashes or major bugs
- [ ] Performance is acceptable on mid-range devices
- [ ] All required permissions are properly declared
- [ ] App follows Google Play policies
- [ ] Content rating is appropriate
- [ ] Privacy policy is accessible (if required)

## Post-Launch Considerations

1. **Monitor App Performance**
   - Use Google Play Console analytics
   - Monitor crash reports and user feedback
   - Track app downloads and user engagement

2. **Regular Updates**
   - Plan feature updates and bug fixes
   - Update web app and sync with native project
   - Increment version number for each update
   - Use same keystore for signing updates

3. **User Support**
   - Respond to user reviews
   - Provide support contact information
   - Consider implementing in-app feedback system

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all dependencies are installed
   - Check Android SDK path configuration
   - Verify Java version compatibility

2. **App Signing Issues**
   - Keep keystore file secure and backed up
   - Store keystore passwords safely
   - Use same keystore for all updates

3. **Play Store Rejection**
   - Read rejection reasons carefully
   - Address all policy violations
   - Resubmit with necessary changes

### Getting Help

- Capacitor Documentation: https://capacitorjs.com/docs
- Android Developer Guides: https://developer.android.com/guide
- Google Play Console Help: https://support.google.com/googleplay/android-developer

## Estimated Timeline

- **Development Phase**: 5-7 days (already completed)
- **Testing and Polish**: 2-3 days
- **Play Store Setup**: 1-2 days
- **Review Process**: 1-7 days (Google's timeline)

**Total Time to Launch**: Approximately 1-2 weeks from development completion to live app.

---

**Note**: Keep all credentials, keystores, and sensitive information secure. Never commit keystore files or passwords to version control.