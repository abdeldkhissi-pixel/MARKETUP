# MARKETUP – Learn Marketing by Playing

Application interactive d'apprentissage du marketing (18 domaines, 90 chapitres, 450 leçons, 2 250 exercices, 6 simulateurs professionnels, défis quotidiens et certificats) avec sauvegarde locale et projet Android Capacitor prêt à compiler.

## Démarrage Web (développement)

```bash
npm install
npm run dev
```

## Compilation Android & Génération de l'APK

Le dossier `android/` et `capacitor.config.ts` sont déjà configurés pour **MARKETUP** (`com.marketup.app`).

### Option 1 : Via GitHub Actions (téléchargement direct de l'APK sans Android Studio)

1. Poussez ce dépôt sur GitHub.
2. Ouvrez l'onglet **Actions** du dépôt puis lancez le workflow **Build Android APK** (ou poussez sur `main`).
3. À la fin du build (~2 minutes), téléchargez l'artefact **`marketup-debug-apk`** contenant le fichier `.apk`.

### Option 2 : En local (Ligne de commande ou Android Studio)

```bash
npm install
npm run android:sync
cd android
./gradlew assembleDebug
```

L'APK généré se trouve dans :
`android/app/build/outputs/apk/debug/app-debug.apk`

Pour ouvrir directement dans Android Studio :

```bash
npm run android:open
```
