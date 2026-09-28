# À LIRE AVANT TOUTE FUTURE MISE À JOUR

Identité immuable : com.morashawiri.boutiquepilot. Clé PKCS12 durable, alias boutiquepilot-app. Empreinte publique attendue : f8b6ad7afe5f7adf2adae89c353d8b9ddeccd1c01f5de558d5f9fffacc42b597.

## Environnement et reconstruction

Référence du dépôt : https://github.com/rmshawiri/boutiquepilot, branche android/beta. Lire GIT-REFERENCE.txt dans l’archive privée pour les commits exacts. Le snapshot Sources contient les sources Android, la bêta HTML de référence, les lockfiles et la chaîne CI. Ne pas reconstruire l’application métier.

Versions : Node 22 ou compatible >=22 ; Capacitor core/android/cli 8.5.2 ; JDK 21 ; Gradle 8.14.3 (wrapper) ; Android Gradle Plugin 8.13.0 ; SDK plateforme 36 / Build Tools 36.0.0 ; bundletool 1.18.3 ; minSdk 24, targetSdk 36. Les dépendances sont dans les lockfiles. Internet est nécessaire pour réinstaller les outils et dépendances ; les outils lourds ne sont pas inclus intégralement dans l’archive portable.

Dans Sources : npm ci pour les outils de tests parent ; dans Sources/mobile : npm ci, npm run sync, npm test. Configurer JAVA_HOME et ANDROID_HOME localement ; ne jamais versionner local.properties. Dans mobile/android : gradlew assembleRelease bundleRelease. Sans variables privées de signature, la sortie release reste non signée. La CI produit les mêmes fichiers avec manifeste, contrôles et outils officiels.

Vérifier l’intégrité de public/beta/BoutiquePilot.html : 4ecb9146067438df0da2fa74e367118dc3e0b28496f5e7fda076fcced4dbb6e5. Ne jamais changer l’origine interne https://localhost ni la clé localStorage pour une simple mise à jour.

## Restaurer la signature

L’archive privée contient Coffre/boutiquepilot-app.p12, chiffré, mais PAS les mots de passe. Conserver séparément signing-private.json dans un gestionnaire de secrets ou un support chiffré différent. Sur cet ordinateur, ce fichier est dans C:/Users/HP/.boutiquepilot-signing/. Ne pas en publier le contenu.

Sur une autre machine, créer un dossier privé accessible uniquement au propriétaire, y restaurer le .p12, signing-private.json et last-delivery.json. Vérifier le certificat avec keytool en passant le mot de passe par environnement ou saisie masquée, jamais dans une commande mémorisée. Comparer l’empreinte à celle ci-dessus. Ne jamais régénérer une clé si la précédente manque.

L’archive ZIP privée n’est pas elle-même chiffrée : le keystore qu’elle contient l’est et son mot de passe est conservé séparément. Le dossier local de l’archive est protégé par ACL. Stocker l’archive sur un support chiffré, idéalement avec une seconde copie hors de l’ordinateur. Le SHA-256 vérifie l’intégrité, pas la confidentialité.

## Nouvelle version

1. Repartir du checkpoint livré, contrôler Git et sauvegarder les données de test.
2. Augmenter versionCode au-delà de toute version déjà distribuée (actuellement 4), mettre à jour versionName et métadonnées npm. Garder package, clé, format JSON et origine locale.
3. Tests pertinents ; compiler APK/AAB depuis le même commit ; conserver package.txt et manifeste du bundle avec les sorties non signées.
4. Signer d’abord l’APK avec scripts/sign-local.py : --input APK --apksigner JAR --java JAVA --output DESTINATION --vault COFFRE. Le script exige une version croissante et enregistre last-delivery.json.
5. Signer ensuite le AAB avec scripts/sign-bundle.py : --input AAB --jdk DOSSIER_JDK --bundletool JAR --output DESTINATION --vault COFFRE. Il impose la même version que l’APK signé, vérifie JAR/certificat/bundletool. Un AAB se signe avec jarsigner, pas apksigner.
6. Vérifier signatures, empreintes, ZIP, package/minSdk/targetSdk, absence de secrets et mise à jour réelle avec données. Archiver le reçu et les deux livrables. Pas de publication automatique.

Une correction du métier ou des adaptateurs exige une revue et les tests adaptés. La Bêta 4 est candidate à validation finale ; les validations propriétaire manquantes ne doivent jamais être transformées en succès implicites.

## Deux archives distinctes

MAINTENANCE MASTER PRIVE : sources, documentation, outils de signature portables, référence Git, certificat public, keystore chiffré, reçu de dernière livraison. Pas de mot de passe, token, SMTP ni secret tiers. Jamais Git/Play/public.

Google Play Package : AAB/APK publics signés, identité graphique, textes/checklists, rapports techniques et certificat public. Aucun keystore ni secret. Les captures et affiches finales manquantes sont signalées explicitement.

Avant diffusion, vérifier le certificat Play App Signing : l’AAB signé constitue une soumission authentifiée, mais Google signe les APK distribués avec la clé configurée dans Play. Préserver la continuité avec les installations directes demande de configurer la même identité de signature appropriée, pas simplement d’utiliser la même clé d’upload.
