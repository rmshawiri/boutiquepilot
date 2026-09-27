# BoutiquePilot Android Bêta — audit et préparation

27 septembre 2026. Cahier des charges officiel lu intégralement ; copie de référence dans `docs/Cahier-des-charges.md`.

## Référence et checkpoint

- Dépôt : `Information clés/04 Codes`, initialement propre sur `main`.
- HEAD initial : `922401740afe1da92d1682a322f6991ae6de5294` (Pixel sur la landing uniquement).
- Source officielle : `Information clés/01 Notre Outil/BoutiquePilot.html`.
- Copie versionnée identique : `public/beta/BoutiquePilot.html`.
- SHA-256 commun : `4ecb9146067438df0da2fa74e367118dc3e0b28496f5e7fda076fcced4dbb6e5`.
- Checkpoint annoté `android-beta-source-20260927`, résolu et vérifié vers le HEAD ci-dessus avant modification Android.
- Branche de travail isolée : `android/beta`. Aucun déploiement du site prévu.

## Constat technique

Application HTML autonome avec CSS, JavaScript et images embarquées. Aucun src/href HTTP distant ; aucun fetch, XMLHttpRequest, WebSocket ou service worker. Le Pixel de la landing ne fait pas partie de la bêta. Les 14 modules et les règles de gestion sont dans le fichier source.

Stockage actuel : `localStorage`, clé `boutique-pilot-kmf`, schéma version 3. Transactions par copie, validation puis écriture ; détection des changements inter-onglets et refus en cas de stockage saturé. Conservation de cette logique et de l'origine interne Android stable. Les données de l'application resteront privées à son WebView, persistantes entre lancements ; désinstallation/effacement des données nécessitent une sauvegarde externe.

Sauvegarde : `backupData()` produit le JSON existant et son compteur ; export par Blob/lien download ; import par input file, File.text, JSON.parse, migrate, confirmation et replaceDB. Aucune conversion du format Android n'est permise. Convention `BoutiquePilot_SAUV_JJ-MM-AAAA_XX.json` conservée. Import/export à tester dans les deux directions sur données représentatives.

Autre accès système : `window.print()` pour les tickets, à connecter au service d'impression Android (dont PDF). Dialogues confirm/alert à conserver. Menus déroulants dans la page déjà intégrés dans la référence.

## Architecture retenue

Capacitor 8.5.2, Android natif pour l'enveloppe seulement, contenu web intégral embarqué. Ni reconstruction métier, ni serveur distant. La préparation vérifie le hash et ajoute seulement des ressources/adaptateurs Android autour de la source intacte. L'application publique et sa référence ne sont pas modifiées.

Identifiant technique de travail : `com.morashawiri.boutiquepilot` (à confirmer avant publication). Origine interne stable `https://localhost`. Pas de permission Internet ni de stockage global ; sélection/enregistrement explicite par Storage Access Framework. Pas de cloud, pas d'analytics, pas de Meta Pixel dans Android. Sauvegarde automatique système désactivée pour conserver le modèle local explicite.

Adaptateurs prévus : sélecteur JSON natif, enregistrement JSON natif, impression, retour Android, zones système et clavier. Identité : icône officielle fournie, déclinée sans redessin ; lancement bref embarqué. Les scripts métier et les données de démonstration resteront inchangés.

## Outils et contraintes constatées

Windows, Node 24 disponible, environ 8 Go RAM et 15,7 Go libres au départ. Aucun JDK, SDK Android ou émulateur préinstallé détecté. Installation locale minimale JDK/SDK, sans Android Studio complet, puis vérification de l'accélération avant émulation. Aucun achat.

SDK cible 36, conformément à l'exigence Google Play consultée. API minimale dépend du socle Capacitor retenu. Tests réels Android indispensables : compilation seule insuffisante. Signature release et identité de publication ne seront pas présentées comme validées sans décision/clé du propriétaire. Aucune publication Google Play autorisée.

Sources techniques officielles consultées :
- https://capacitorjs.com/docs/getting-started/environment-setup
- https://capacitorjs.com/docs/android/custom-code
- https://developer.android.com/studio
- https://developer.android.com/studio/run/emulator-commandline
- https://support.google.com/googleplay/android-developer/answer/11926878?hl=en

## Critères de contrôle

Contrôle statique d'intégrité ; tests ciblés de l'adaptation fichiers et impression ; comparaison des règles/calculs web et Android ; navigation des 14 modules ; vrai mode avion ; arrêt forcé et redémarrage appareil/émulateur ; aller-retour JSON bidirectionnel. APK installable et AAB de publication, 4 captures Android réelles et 4 affiches seront livrés uniquement une fois les prérequis démontrés.
