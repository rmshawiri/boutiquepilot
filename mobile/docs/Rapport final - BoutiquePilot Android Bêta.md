# Rapport final - BoutiquePilot Android Bêta

Date : 28 septembre 2026.

**DÉVELOPPEMENT ANDROID : TERMINÉ. VALIDATION FONCTIONNELLE PROPRIÉTAIRE : RÉUSSIE. GOOGLE PLAY : PRÉPARÉ, NON PUBLIÉ.**

La clôture des ressources marketing reste bloquée par l’absence des quatre captures Android dans le dossier prévu ; aucun visuel final contenant une fausse capture n’a été fabriqué. Aucun résultat de téléphone non communiqué n’est inventé. Aucune publication Google Play, aucun achat et aucune désinstallation du téléphone n’ont été effectués.

## Version livrée

| Élément | Valeur |
|---|---|
| ApplicationId | com.morashawiri.boutiquepilot |
| versionName / versionCode | 1.0.0-beta.4 / 4 |
| minSdk / targetSdk | 24 (Android 7.0) / 36 |
| Build APK et AAB | même commit 60705006510a77e26b7b9cecdc33890c135b9ab9 |
| Exécution réussie | https://github.com/rmshawiri/boutiquepilot/actions/runs/36385902772 |
| Certificat durable SHA-256 | f8b6ad7afe5f7adf2adae89c353d8b9ddeccd1c01f5de558d5f9fffacc42b597 |
| APK SHA-256 | 6fffb31b80fab08fadf0247df86dc256c6283455f2df854ba65aa3bcb68dd502 |
| AAB SHA-256 | 5031a5318692511ad9b7193b78fc7e642be115138d4a63ef99b40acc119b207a |

Bêta 4 est validée fonctionnellement par le propriétaire. Les mêmes APK/AAB sont retenus, sans reconstruction ni Bêta 5 documentaire. Toute nouvelle version binaire devra avoir un versionCode supérieur et la même clé durable.

## Architecture conservée

Capacitor 8.5.2 embarque intégralement la bêta HTML. Origine interne https://localhost, stockage local inchangé. Aucun serveur distant, aucune permission INTERNET, pas de Pixel, SDK publicitaire ou collecte analytics embarqués. Android gère le sélecteur de documents et l’impression ; le texte JSON métier n’est pas transformé. Aucun module ajouté ou retiré.

APK Bêta 3/Bêta 4 : HTML, adaptateurs JS/CSS, icône, configuration Capacitor et ressources launcher comparés directement dans les APK, identiques. Le code Java des adaptations reste inchangé dans cette phase. BoutiquePilot.html de référence et sa copie publique restent intacts : SHA-256 4ecb9146067438df0da2fa74e367118dc3e0b28496f5e7fda076fcced4dbb6e5.

## Historique et signature

- Bêta 1 : première enveloppe et test général propriétaire ; signature debug temporaire.
- Bêta 2 : logo transparent sur blanc, animation ~3 s et Quitter avec confirmation ; autre certificat debug, donc mise à jour incompatible.
- Bêta 3 : première signature durable et release non débogable. Le propriétaire confirme installation réussie, icône, premier écran blanc/logo complet, second écran bleu animé et lancement normal.
- Bêta 4 : même package et même certificat que Bêta 3, version 4, production APK/AAB et préparation finale. Aucune différence métier artificielle.

La clé privée PKCS12 est chiffrée dans un coffre local avec ACL limitées au propriétaire et SYSTEM. Les mots de passe restent hors Git, APK/AAB, ZIP Play et rapports. GitHub produit des sorties non signées ; la signature locale officielle évite de transmettre la clé au runner. Le script refuse la réutilisation d’un versionCode livré. La procédure de restauration est dans 11-maintenance-restauration.md.

## Vérifications réalisées dans cette phase

- Intégrité de la source et absence de ressource/serveur externe : réussi.
- 14 scénarios métier : conversions de conditionnements, ventes/stock, transferts, coûts historiques, poids, inventaire, promotions, Huri/Yas, sauvegardes, atomicité, données invalides et démonstration : réussis.
- 9 scénarios d’intégrité : migrations, CMP, emplacements, conversions invalides, données incohérentes, quota, concurrence et compteurs : réussis.
- Simulation navigateur avec pont Android : navigation des 14 modules, persistance navigateur, JSON bidirectionnel identique, import invalide, annulation de lecture, erreur de lecture, annulation/erreur d’écriture et adaptateur impression : réussis. Aucune erreur JavaScript ni requête externe. Ce ne sont pas des tests de sélecteur ou d’impression sur Android réel.
- Animation mesurée en simulation : environ 3,06 s ; logo et icônes inchangés. Rendu natif initial déjà constaté sur Bêta 3 par le propriétaire ; écrans, animation et ergonomie confirmés réussis sur Bêta 4 par le propriétaire.
- Compilation assembleRelease et bundleRelease : réussie. APK release non débogable, package/version et manifeste contrôlés ; minSdk 24, cible 36 ; pas de permission inutile ajoutée ni bibliothèque native lib/.
- APK signé : signatures v2/v3 et certificat attendu vérifiés par apksigner pour API 24 à 36 ; CRC, alignement avant signature et contenu après signature contrôlés.
- AAB signé localement par jarsigner : vérification stricte avec certificat de confiance attendu, métadonnées et bundletool validate réussis. Un APK universel a été généré depuis cet AAB avec le même certificat, vérifié par apksigner et comparé au contenu applicatif livré. Ceci ne constitue pas une installation sur appareil.
- Les fichiers de sommes de contrôle APK/AAB sont distincts pour éviter toute ambiguïté de nom.

## Validation réelle — état exact

| Critère | État |
|---|---|
| Installation et lancement Bêta 3 | Confirmés par le propriétaire |
| Icône, logo blanc et écran bleu Bêta 3 | Confirmés par le propriétaire |
| Bêta 3 → Bêta 4 sans désinstallation | RÉUSSI — confirmé par le propriétaire |
| Données conservées après mise à jour | RÉUSSI — confirmé par le propriétaire |
| Mode avion, arrêt forcé, relance et redémarrage | RÉUSSI — mode avion, arrêt/reprise et redémarrage confirmés |
| Android → fichier réel → navigateur | RÉUSSI — sauvegardes et compatibilité confirmées |
| Navigateur → fichier réel → Android et reprise | RÉUSSI — import/restauration et persistance confirmés |
| Impression PDF et annulation | RÉUSSI — impression/PDF confirmé |
| Quitter / Annuler et Retour Android | RÉUSSI — Quitter/Annuler et navigation confirmés |
| Quatre captures Android | Instructions prêtes ; captures propriétaire requises |
| Quatre affiches | Exactement quatre structures SVG ; finalisation après captures |

Les résultats réels sont enregistrés dans 08-validation-proprietaire.md, sur la base de la confirmation explicite du propriétaire. Ils sont distincts des tests automatisés et ne constituent pas une approbation Google Play.

## Livrables et archives

Dans 04 Livrables :

- BoutiquePilot-Android-1.0.0-beta.4.apk et .aab, avec empreintes et preuves de signature.
- Google-Play-Package/ et BoutiquePilot-Google-Play-Package.zip : APK/AAB, icône 512 px, feature graphic 1024 × 500, textes store, déclarations à valider, manifeste/rapports/certificat public. Le dossier captures contient uniquement des consignes ; les quatre modèles d’affiches sont marqués non publiables. Ce package n’est pas prêt à soumettre tant que les points bloquants restent ouverts.
- Archives/ : anciens APK et preuves conservés sans modification.
- LISEZ-MOI-LIVRABLES.md et SHA256SUMS-FINAL.txt : orientation et empreintes exactes de l’APK, du AAB et des deux ZIP.

Archive privée : C:/Users/HP/.boutiquepilot-signing/Archives/BoutiquePilot-Android-MAINTENANCE-MASTER-PRIVE.zip. Hors dossier partageable et hors Git. Contient snapshot source versionné, référence du commit, scripts/configurations/lockfiles, documentation, outils portables apksigner/bundletool, certificat public, reçu de dernière livraison et keystore chiffré. Aucun mot de passe dans ce ZIP ; le propriétaire doit conserver signing-private.json séparément sur support chiffré. Le ZIP n’est pas lui-même chiffré : le PKCS12 l’est, avec mot de passe indépendant. Sauvegarde externe physique encore à effectuer par le propriétaire.

Les contrôles effectifs des archives, leur SHA-256 et le checkpoint exact sont consignés dans Controle-final-livraison.json, avec GIT-REFERENCE.txt dans chaque archive. Cette séparation évite de créer une empreinte circulaire d’une archive contenant sa propre empreinte.

## Google Play readiness

API cible 36 conforme à l’exigence mobile consultée au 28/09/2026. APK et AAB techniquement construits/signés, bundle validé. Aucune approbation Play n’est revendiquée.

Restent avant soumission : quatre captures, politique Android approuvée/publiée et accessible dans l’application, déclarations Data Safety/public cible/contenu, coordonnées administratives si requises, choix Play App Signing préservant les mises à jour entre APK directs et Play, vérification du compte et de ses éventuelles obligations de test fermé. Voir 10-confidentialite-et-play.md et ses sources officielles. Aucun contenu légal non validé ni nouvelle URL n’a été publié.

## Conclusion de livraison

La validation fonctionnelle est clôturée avec succès. Les APK/AAB et le mécanisme de mise à jour sont validés par les contrôles techniques et les essais propriétaire. Les captures et quatre affiches finales restent bloquées par les fichiers manquants. Les décisions Play/juridiques et la publication appartiennent au chantier séparé Play Console. Aucun nouveau développement métier n’est ouvert.

## Documents de clôture préparés

13-checklist-play-console.md : étapes ordonnées et décisions propriétaire. 14-play-app-signing.md : continuité du certificat existant et distinction signature/importation. 15-politique-confidentialite-android.md : texte reflétant le fonctionnement réel. Page statique préparée dans mobile/store/privacy-page/, non publiée et non embarquée dans Bêta 4. Les modalités juridiques/support restent à approuver ; aucune URL publique n’est présentée comme active.
