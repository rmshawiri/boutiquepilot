# BoutiquePilot Android Bêta

Enveloppe Capacitor de la bêta officielle. Aucun chargement du site public, aucune reconstruction métier. Le cahier des charges et l'audit sont dans `docs/`.

## Reproduction

Node >=22, JDK 21, Android SDK 36 / Build Tools 36, puis :

```
npm ci
npm run sync
npm run check
cd android
gradlew.bat assembleDebug
```

Définir JAVA_HOME, ANDROID_HOME et `android/local.properties` localement. Les dépendances et SDK nécessitent Internet pour compiler ; l'APK embarque les ressources et n'en dépend pas pour fonctionner.

L'icône est générée par `node scripts/icons.mjs` (sharp disponible dans le dépôt parent). La source web est copiée depuis `../public/beta/BoutiquePilot.html` après vérification SHA-256. `www/` et les assets Android sont reproductibles et exclus de Git.

## Adaptations

- La source officielle demeure intacte. `native/android.js` adapte uniquement les entrées/sorties natives et le lancement.
- Export via ACTION_CREATE_DOCUMENT, import via ACTION_OPEN_DOCUMENT. Même texte JSON, mêmes fonctions backupData/importData/migrate/replaceDB. Annulation et erreur ne sont jamais présentées comme réussite. Lecture plafonnée à 32 Mio pour protéger la mémoire du téléphone ; aucune transformation JSON.
- Impression du ticket via Android PrintManager.
- localStorage à l'origine interne stable https://localhost. Arrêt/reprise et redémarrage doivent être testés sur appareil ; désinstallation/effacement des données effacent le stockage local.
- Aucune permission Internet ni d'accès global au stockage. Sauvegarde automatique Android désactivée. Export manuel à conserver hors de l'application.
- Clé privée et mots de passe hors dépôt ; signature release via variables d'environnement uniquement.

## État de validation

Une compilation n'est pas une validation Android. Les preuves réelles, limites et tests restant à effectuer sont consignés dans `Information clés/07 Application Mobile Bêta/05 Rapports App/`. Les APK/AAB finaux seuls vont dans `04 Livrables/`. Aucune publication Google Play automatique.
