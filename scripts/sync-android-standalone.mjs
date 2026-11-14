import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcCapAndroid = path.join(root, 'node_modules', '@capacitor', 'android', 'capacitor');
const destCapAndroid = path.join(root, 'android', 'capacitor-android');
const capSettingsPath = path.join(root, 'android', 'capacitor.settings.gradle');

if (!fs.existsSync(srcCapAndroid)) {
  console.error('Missing node_modules/@capacitor/android/capacitor. Run npm install first.');
  process.exit(1);
}

fs.rmSync(destCapAndroid, { recursive: true, force: true });
fs.cpSync(srcCapAndroid, destCapAndroid, { recursive: true });

// Remove stale empty app build folder if present
fs.rmSync(path.join(root, 'android', 'app', 'build'), { recursive: true, force: true });

function patchGradleCompatibility(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content
    .replace(/com\.android\.tools\.build:gradle:[0-9.]+/g, 'com.android.tools.build:gradle:8.7.3')
    .replace(/JavaVersion\.VERSION_21/g, 'JavaVersion.VERSION_17')
    .replace(/:\s*36\b/g, ': 35')
    .replace(/abortOnError\s*=\s*true/g, 'abortOnError = false')
    .replace(/warningsAsErrors\s*=\s*true/g, 'warningsAsErrors = false');
  fs.writeFileSync(filePath, content, 'utf8');
}

patchGradleCompatibility(path.join(destCapAndroid, 'build.gradle'));
patchGradleCompatibility(path.join(root, 'android', 'app', 'capacitor.build.gradle'));
patchGradleCompatibility(path.join(root, 'android', 'capacitor-cordova-android-plugins', 'build.gradle'));

const capSettingsContent = `// Standalone-friendly Capacitor settings (auto-synced by scripts/sync-android-standalone.mjs)
include ':capacitor-android'
def vendoredCapDir = new File(settingsDir, 'capacitor-android')
def nodeModulesCapDir = new File(settingsDir, '../node_modules/@capacitor/android/capacitor')
project(':capacitor-android').projectDir = vendoredCapDir.exists() ? vendoredCapDir : nodeModulesCapDir
`;

fs.writeFileSync(capSettingsPath, capSettingsContent, 'utf8');
console.log('Synced standalone capacitor-android (AGP 8.7.3 / Gradle 8.9 / SDK 35 / Java 17)');
