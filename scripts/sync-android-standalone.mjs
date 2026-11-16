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
    .replace(/com\.android\.tools\.build:gradle:[0-9.]+/g, 'com.android.tools.build:gradle:8.10.1')
    .replace(/JavaVersion\.VERSION_21/g, 'JavaVersion.VERSION_1_8')
    .replace(/JavaVersion\.VERSION_17/g, 'JavaVersion.VERSION_1_8')
    .replace(/:\s*36\b/g, ': 35')
    .replace(/abortOnError\s*=\s*true/g, 'abortOnError = false')
    .replace(/warningsAsErrors\s*=\s*true/g, 'warningsAsErrors = false');
  fs.writeFileSync(filePath, content, 'utf8');
}

function patchJava8SourceCompatibility() {
  // 1) Convert Java 15 text blocks in SystemBars.java to Java 8 string concatenation
  const systemBarsPath = path.join(
    destCapAndroid,
    'src/main/java/com/getcapacitor/plugin/SystemBars.java'
  );
  if (fs.existsSync(systemBarsPath)) {
    let content = fs.readFileSync(systemBarsPath, 'utf8');
    content = content.replace(
      /static final String viewportMetaJSFunction = """[\s\S]*?""";/,
      `static final String viewportMetaJSFunction =\n` +
        `        "function capacitorSystemBarsCheckMetaViewport() {\\n" +\n` +
        `        "    const meta = document.querySelectorAll(\\"meta[name=viewport]\\");\\n" +\n` +
        `        "    if (meta.length == 0) {\\n" +\n` +
        `        "        return false;\\n" +\n` +
        `        "    }\\n" +\n` +
        `        "    // get the last found meta viewport tag\\n" +\n` +
        `        "    const metaContent = meta[meta.length - 1].content;\\n" +\n` +
        `        "    return metaContent.includes(\\"viewport-fit=cover\\");\\n" +\n` +
        `        "}\\n" +\n` +
        `        "capacitorSystemBarsCheckMetaViewport();";`
    );
    content = content.replace(
      /String script = String\.format\(\s*Locale\.US,\s*"""[\s\S]*?""",/,
      `String script = String.format(\n` +
        `                    Locale.US,\n` +
        `                    "try {\\n" +\n` +
        `                    "  document.documentElement.style.setProperty(\\"--safe-area-inset-top\\", \\"%dpx\\");\\n" +\n` +
        `                    "  document.documentElement.style.setProperty(\\"--safe-area-inset-right\\", \\"%dpx\\");\\n" +\n` +
        `                    "  document.documentElement.style.setProperty(\\"--safe-area-inset-bottom\\", \\"%dpx\\");\\n" +\n` +
        `                    "  document.documentElement.style.setProperty(\\"--safe-area-inset-left\\", \\"%dpx\\");\\n" +\n` +
        `                    "} catch(e) { console.error('Error injecting safe area CSS:', e); }",`
    );
    fs.writeFileSync(systemBarsPath, content, 'utf8');
  }

  // 2) Convert Java 14 switch expression in WebViewLocalServer.java to standard Java 8 switch statement
  const localServerPath = path.join(
    destCapAndroid,
    'src/main/java/com/getcapacitor/WebViewLocalServer.java'
  );
  if (fs.existsSync(localServerPath)) {
    let content = fs.readFileSync(localServerPath, 'utf8');
    content = content.replace(
      /return switch \(code\) \{([\s\S]*?)\n\s*\};/,
      (_match, body) => {
        const cases = body
          .replace(/case\s+(\d+)\s*->\s*"([^"]+)";/g, 'case $1: return "$2";')
          .replace(/default\s*->\s*"([^"]+)";/g, 'default: return "$1";');
        return `switch (code) {${cases}\n        }`;
      }
    );
    fs.writeFileSync(localServerPath, content, 'utf8');
  }
}

patchGradleCompatibility(path.join(destCapAndroid, 'build.gradle'));
patchGradleCompatibility(path.join(root, 'android', 'app', 'capacitor.build.gradle'));
patchGradleCompatibility(path.join(root, 'android', 'capacitor-cordova-android-plugins', 'build.gradle'));
patchJava8SourceCompatibility();

const capSettingsContent = `// Standalone-friendly Capacitor settings (auto-synced by scripts/sync-android-standalone.mjs)
include ':capacitor-android'
def vendoredCapDir = new File(settingsDir, 'capacitor-android')
def nodeModulesCapDir = new File(settingsDir, '../node_modules/@capacitor/android/capacitor')
project(':capacitor-android').projectDir = vendoredCapDir.exists() ? vendoredCapDir : nodeModulesCapDir
`;

fs.writeFileSync(capSettingsPath, capSettingsContent, 'utf8');
console.log('Synced standalone capacitor-android (AGP 8.10.1 / Gradle 8.13 / SDK 35 / Java 8)');
