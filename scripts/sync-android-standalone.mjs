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

const capSettingsContent = `// Standalone-friendly Capacitor settings (auto-synced by scripts/sync-android-standalone.mjs)
include ':capacitor-android'
def vendoredCapDir = new File(settingsDir, 'capacitor-android')
def nodeModulesCapDir = new File(settingsDir, '../node_modules/@capacitor/android/capacitor')
project(':capacitor-android').projectDir = vendoredCapDir.exists() ? vendoredCapDir : nodeModulesCapDir
`;

fs.writeFileSync(capSettingsPath, capSettingsContent, 'utf8');
console.log('Synced standalone capacitor-android into android/capacitor-android');
