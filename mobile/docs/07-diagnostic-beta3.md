# Diagnostic packaging et livraison Bêta 3

28 septembre 2026. Périmètre : signature et mises à jour Android. Aucun changement métier, aucun changement de package, aucune publication Google Play.

## Diagnostic établi avant livraison

Les certificats extraits des deux APK précédents sont différents :

- Bêta 1 : `f3941df1a9eaedc7e22e3543fd5c2b7d3c2f60cdd2e9f52b8296be008faa6569`.
- Bêta 2 : `e4f1990df2734c3b8297f7b23345f9eae5c6f3f2718411bef83bab56e4334e8e`.

Cause certaine du refus de mise à jour Bêta 1 → Bêta 2 : chaque runner recréait une clé Android Debug différente. Ces APK partageaient le même applicationId mais pas leur identité de signature. Cette stratégie de compilation était inadaptée à une distribution avec mises à jour.

Le refus persistant après désinstallation ne peut pas être attribué précisément à partir du seul message graphique. Android regroupe plusieurs conflits sous ce message : certificat incompatible, permission ou fournisseur déjà détenu par un package, par exemple. Une présence résiduelle dans un autre utilisateur/profil est une possibilité, pas un diagnostic établi. Aucune manipulation de téléphone ni changement d’identité n’est utilisé comme contournement. La cause de ce second refus reste indéterminée faute de code PackageManager.

Références officielles : [conditions de mise à jour](https://developer.android.com/google/play/app-updates) et [conflits PackageInstaller](https://developer.android.com/reference/android/content/pm/PackageInstaller).

## Inspection réelle de Bêta 2

Manifeste binaire extrait de l’APK, certificat extrait du bloc de signature et inspecté par keytool, puis vérification par apksigner officiel :

- Package : `com.morashawiri.boutiquepilot`.
- versionCode 2 ; versionName `1.0.0-beta.2`.
- minSdk 24 (Android 7.0) ; targetSdk/compileSdk 36.
- Signature v2 valide, testée explicitement avec min SDK 24 et max SDK 36 ; certificat Android Debug RSA 2048.
- Archive CRC valide ; empreinte identique au fichier livré ; aucune bibliothèque native imposant une ABI.
- Pas de sharedUserId ni testOnly. Application débogable dans cette ancienne version.
- Autorités des fournisseurs : `com.morashawiri.boutiquepilot.fileprovider` et `com.morashawiri.boutiquepilot.androidx-startup`.
- Permission interne AndroidX : `com.morashawiri.boutiquepilot.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`, niveau signature. Ces noms sont correctement rattachés au package ; aucune collision interne constatée.

Ces contrôles confirment la compatibilité déclarée du packaging et de la signature Android 7+, pas une installation effectivement exécutée sur tous les appareils. Aucun test sur émulateur/API 24 ou sur téléphone n’est présenté comme réalisé.

## Correction durable

Clé RSA 3072 créée une seule fois, certificat valable jusqu’au 19 septembre 2056, keystore PKCS12 chiffré. Alias stable `boutiquepilot-app`.

Certificat public durable SHA-256 :
`f8b6ad7afe5f7adf2adae89c353d8b9ddeccd1c01f5de558d5f9fffacc42b597`.

Le coffre privé se trouve dans `C:/Users/HP/.boutiquepilot-signing/`, hors dépôt. Accès Windows limité au propriétaire et SYSTEM. Il contient le keystore chiffré, les informations nécessaires à son utilisation et le reçu du dernier versionCode livré. Aucun secret ne figure ici. Le certificat public seul est versionné.

Le jeton du fichier confidentiel local permet les push/workflows, mais l’API Secrets a retourné HTTP 403. Aucune clé n’a été envoyée aux Secrets GitHub. La solution retenue ne dépend pas de cette permission : compilation release non signée sur GitHub, signature locale avec l’outil officiel apksigner et mots de passe transmis uniquement dans l’environnement du processus enfant.

Le script `mobile/scripts/sign-local.py` vérifie le package, la version, l’absence de mode debug, le certificat exact, la signature pour API 24 à 36 et l’intégrité du contenu. Il refuse un versionCode non supérieur à la dernière livraison ou l’écrasement d’un APK existant. Test de refus d’un versionCode répété : réussi.

La procédure privée de sauvegarde/restauration et la préparation du test N → N+1 sont dans `06 - Signature durable et mises à jour.md`. Le propriétaire doit conserver une copie du coffre sur un support personnel chiffré indépendant ; aucune sauvegarde physique externe n’a été effectuée par l’assistant. Ne jamais remplacer la clé pour une nouvelle compilation.

La compatibilité durable commence avec Bêta 3. Une nouvelle clé ne peut pas mettre à jour directement les anciennes versions debug signées autrement.

## Nouvel APK contrôlé

- Nom : `BoutiquePilot-Android-Beta-3-signature-durable.apk`, dans `04 Livrables`.
- Package inchangé : `com.morashawiri.boutiquepilot`.
- versionCode : 3 ; versionName : `1.0.0-beta.3`.
- minSdk : 24 ; targetSdk : 36 ; release non débogable.
- Signature v2 et v3 vérifiée ; empreinte du signataire égale au certificat durable attendu.
- SHA-256 : `3d8d1f250737ed0b50248eb554b0d3c783bfa22451394bd8993b534faf808b1d`.
- Commit compilé : `cae60ba2661d87bced004cee64fc3635286b3276`.
- Build : https://github.com/rmshawiri/boutiquepilot/actions/runs/36356205753
- Alignement contrôlé dans le runner avant signature ; les entrées de l’archive sont identiques après signature, CRC valide.
- HTML, adaptateurs JS/CSS et icône embarqués identiques à Bêta 2. Les trois corrections restent présentes et les mécanismes JSON sont inchangés.
- Aucun keystore, mot de passe ou secret de signature dans les fichiers suivis ou dans l’APK. Anciens APK conservés sans modification.
- BoutiquePilot.html de référence et copie publique : SHA-256 inchangé `4ecb9146067438df0da2fa74e367118dc3e0b28496f5e7fda076fcced4dbb6e5`.

## Validation restante

Installer Bêta 3 sur le téléphone de test. L’installation réelle n’est pas encore confirmée. Si le refus subsiste malgré ce packaging vérifié, il faudra relever le code d’erreur Android pour expliquer le conflit restant ; changer de clé ou de package à nouveau ne serait pas une solution durable.

Après installation réussie, créer des données de test puis préparer Bêta 4 avec la même clé et un versionCode supérieur. Installer par-dessus sans désinstallation et vérifier les données, paramètres, ventes/stocks et sauvegardes. Ce test de mise à jour reste un critère obligatoire de livraison finale et n’a pas encore été exécuté.

Arrêt après livraison de Bêta 3 pour le test utilisateur.
