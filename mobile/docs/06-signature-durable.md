# Signature Android durable

Les APK distribués utilisent le package `com.morashawiri.boutiquepilot` et le certificat public versionné dans `resources/signing-certificate.cer`. Ce certificat public ne contient aucune clé privée. Son empreinte attendue est dans `resources/signing-identity.json`.

GitHub Actions compile uniquement un APK release non signé et fournit l’outil officiel apksigner du SDK utilisé. La signature a lieu sur l’ordinateur du propriétaire. Aucun keystore ni mot de passe n’est nécessaire sur GitHub. Les anciens APK debug ne doivent plus être distribués.

La clé privée PKCS12 chiffrée et les informations de signature se trouvent dans `%USERPROFILE%/.boutiquepilot-signing/`, hors dépôt, avec accès Windows limité au propriétaire et SYSTEM. Ne jamais ajouter ces fichiers à Git ou aux livrables publics. Ne jamais recréer la clé pour une nouvelle version.

## Compilation et signature

1. Incrémenter `versionCode` et `versionName` dans `android/app/build.gradle`, sans changer l’applicationId ni l’origine locale Capacitor.
2. Commiter puis pousser sur `android/beta`. Télécharger l’artefact unsigned de la bonne exécution et vérifier ses empreintes.
3. Exécuter `scripts/sign-local.py` avec les chemins `--input`, `--apksigner`, `--java`, `--output`. Le script lit le coffre privé ; ne jamais passer de mot de passe en argument.
4. Le script exige une release non débogable, le package/version attendus, une version supérieure au dernier APK signé, le certificat durable exact, une signature valide pour API 24 à 36 et des entrées ZIP inchangées après signature. Il refuse d’écraser un APK livré.
5. Conserver APK, empreinte, preuve de signature, commit et rapport. Ne distribuer que l’APK signé.

## Sauvegarde privée obligatoire

Copier le dossier privé complet (keystore, informations de signature et reçu last-delivery) sur un support personnel chiffré hors de cet ordinateur, puis conserver une seconde copie privée sécurisée. Le mot de passe est dans `signing-private.json` : ne pas le transmettre dans une conversation, un rapport ou un dépôt. Le contrôle d’accès Windows protège la copie locale mais ne remplace pas le chiffrement du support de sauvegarde. Une copie sur le même disque ne protège pas contre sa perte.

Avant une restauration, contrôler que le certificat extrait du keystore correspond à l’empreinte publique versionnée. Conserver le dernier versionCode distribué. Ne jamais remplacer la clé perdue par une nouvelle en prétendant conserver les mises à jour : sans ancienne clé ni rotation préparée, cette compatibilité est perdue.

## Mise à jour à valider

Installer la première version signée durablement (N), créer des données de démonstration et les exporter pour comparaison. Compiler ensuite N+1 avec un versionCode supérieur et la même clé ; installer par-dessus sans désinstallation. Vérifier données, paramètres, ventes/stock, sauvegarde/import/export et retour normal au tableau de bord. Cette validation réelle reste obligatoire avant livraison finale.

Les anciennes versions debug ont des certificats temporaires distincts. La clé durable ne peut pas les mettre à jour directement. La compatibilité durable commence avec la première version acceptée sous ce nouveau certificat. Aucun changement de package ou seconde application ne contourne cette limite.

Google Play n’est pas configuré. Pour une future distribution Play, décider de Play App Signing en préservant la compatibilité de certificat souhaitée ; une simple clé d’upload différente de la clé de signature Play ne garantit pas les mises à jour entre APK locaux et Play.
