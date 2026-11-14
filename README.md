# MARKETUP – Learn Marketing by Playing

Application interactive d'apprentissage du marketing (18 domaines, 90 chapitres, 450 leçons, 2 250 exercices, 6 simulateurs professionnels, défis quotidiens et certificats) avec sauvegarde locale et projet Android autonome prêt à ouvrir dans Android Studio.

## Démarrage Web (développement)

```bash
npm install
npm run dev
```

## Ouvrir dans Android Studio & Générer l'APK

Le dossier `android/` est autonome (`capacitor-android`, les plugins Capacitor et l'application web compilée dans `app/src/main/assets/public` sont déjà inclus).

### Méthode 1 : Directement dans Android Studio (Windows / macOS / Linux)
1. Téléchargez ou clonez le projet puis décompressez le dossier complet si c'est un `.zip`.
2. Dans Android Studio, cliquez sur **File > Open** et sélectionnez uniquement le sous-dossier **`android`** (et non le dossier racine).
3. Attendez la fin de **Gradle Sync** (téléchargement initial de Gradle / SDK si besoin).
4. Une fois la synchronisation terminée, sélectionnez **`app`** en haut puis cliquez sur **Build > Build App Bundle(s) / APK(s) > Build APK(s)**.
5. L'APK se trouve dans :
   `android/app/build/outputs/apk/debug/app-debug.apk`

### Méthode 2 : Via GitHub Actions (sans installer Android Studio)
1. Poussez ce dépôt sur GitHub.
2. Ouvrez l'onglet **Actions** puis lancez le workflow **Build Android APK** (ou poussez sur `main`).
3. Téléchargez l'artefact **`marketup-debug-apk`** contenant le fichier `app-debug.apk`.

### Mettre à jour le dossier Android après une modification web
```bash
npm install
npm run android:sync
```
