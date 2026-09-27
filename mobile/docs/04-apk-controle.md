# BoutiquePilot Android — livraison de l’APK de contrôle

Date : 27 septembre 2026.

## Résultat

APK prêt pour installation et tests utilisateur, pas encore validé sur téléphone ni destiné à Google Play.

- Fichier : `Information clés/07 Application Mobile Bêta/04 Livrables/BoutiquePilot-Android-Beta-controle.apk`.
- Taille : 7 414 970 octets.
- SHA-256 : `adfdd849e1142d07dcc797f8fed86e9f480d85f23a37590355875b93cedad70f`.
- Identifiant : `com.morashawiri.boutiquepilot` ; version `1.0.0-beta.1`, code 1.
- Android minimum : API 24 (Android 7.0), cible API 36.
- APK debug signé pour contrôle ; signature APK v2 vérifiée par apksigner. La clé de publication protégée reste à préparer avant une livraison release ; aucune clé de publication n’a été transmise à GitHub.

## Reprise et compilation

Les checkpoints existants ont été conservés. Aucun redémarrage du développement ni modification du code métier. Les téléchargements locaux réutilisables sont conservés dans le cache ; l’installation JDK/SDK locale reste partielle. La compilation a été réalisée sur le runner standard GitHub Ubuntu avec JDK 21 et SDK/Build Tools 36 afin de contourner les téléchargements locaux instables.

Le premier essai a uniquement révélé que sdkmanager était absent du PATH du runner. Son chemin installé est maintenant utilisé explicitement. La compilation suivante a réussi sans correction du code applicatif.

- Commit compilé : `b93dd96dfe8c452900b3ed3b3ba768620d7ccbef`.
- Branche : `android/beta`.
- Exécution réussie : https://github.com/rmshawiri/boutiquepilot/actions/runs/36339164320
- Aucune publication Google Play ni modification de la production web.

## Vérifications

- Préparation de la source, contrôle d’intégrité, assembleDebug : réussis.
- apksigner : signature valide ; aapt : identifiant, version, activité de lancement et SDK conformes.
- Aucune permission Internet ou permission globale de stockage dans le manifeste compilé ; seule permission interne AndroidX de récepteur non exporté.
- APK téléchargé : SHA-256 identique au résultat du runner, archive sans corruption, manifeste et DEX présents.
- HTML, icône et adaptateurs embarqués vérifiés contre les sources. Le fichier android.js local Windows utilise CRLF : la comparaison finale exacte est faite contre le blob Git compilé sous Linux, sans modifier l’APK.
- Aucun fichier de clé, environnement ou compte confidentiel empaqueté ; aucune bibliothèque native lib/.
- Source officielle et copie publique inchangées, SHA-256 : `4ecb9146067438df0da2fa74e367118dc3e0b28496f5e7fda076fcced4dbb6e5`.
- Les 14 tests métier, 9 tests d’intégrité et simulations navigateur déjà réussis ne sont pas relancés inutilement. Ils ne constituent pas des tests sur appareil Android.
- Les preuves de signature, métadonnées et empreinte sont conservées avec l’APK dans les livrables.

## Tests à effectuer par le propriétaire

Suivre `03 - Contrôles sur téléphone Android.md` dans `05 Rapports App` (copie versionnée : `mobile/docs/03-tests-telephone.md`). Utiliser uniquement les données de démonstration.

À vérifier réellement : installation, lancement, 14 modules, clavier/barres système, retour Android, mode avion, persistance après arrêt forcé et redémarrage, sauvegarde JSON dans les deux sens avec le navigateur, annulations et erreurs, impression du ticket.

Cet APK utilise une signature de test du runner. Une future compilation peut avoir une autre signature : exporter les données de test avant un remplacement susceptible de nécessiter une désinstallation. Désinstaller efface les données locales.

Aucun téléphone ni émulateur n’a servi à valider cette livraison. Les captures officielles Android, la campagne, la signature release/AAB et Google Play restent hors de cette reprise. Arrêt après livraison pour les tests utilisateur demandés.
