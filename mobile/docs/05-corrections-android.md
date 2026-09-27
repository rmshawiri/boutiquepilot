# Deuxième APK de contrôle — corrections Android

28 septembre 2026. Le premier test réel a été validé par le propriétaire. Cette nouvelle version doit faire l’objet d’un deuxième essai sur son téléphone.

## Corrections réalisées

1. Premier écran natif : fond blanc, logo complet provenant de `Information clés/07 Application Mobile Bêta/02 Icône App/Logo BoutiquePilot Transparent.png`. Copie exacte versionnée dans `mobile/resources/launch-logo.png`. Mise à l’échelle proportionnelle, centrée, avec marges transparentes : aucun recadrage. Tous les pixels visibles tiennent dans le cercle sûr Android. L’icône de l’application reste strictement identique, y compris dans l’APK compilé.
2. Animation suivante conservée, avec barre animée en continu pendant environ 3 secondes. Le splash natif attend la préparation de cette vue ; fondu natif de 180 ms, puis lancement explicite de l’animation. Fondu final à 2,75 s, fin visuelle à 3 s et retrait à 3,05 s. Mesure navigateur avec pont simulé : 3 058 ms. La préférence système de réduction des mouvements reste respectée. Durée/fluidité réelles sur téléphone à confirmer.
3. « Quitter l’application » ajouté au menu Modules uniquement dans l’environnement Android. Le bouton est restauré après les rendus du menu. Confirmation native : « Voulez-vous vraiment quitter BoutiquePilot ? », avec « Annuler » et « Quitter ». Annuler/fermer la boîte ne termine pas l’activité. Quitter appelle `finishAndRemoveTask()` ; aucune suppression de stockage ni arrêt forcé du processus. Protection contre l’ouverture de plusieurs confirmations. Le gestionnaire du bouton Retour est inchangé.

Référence technique des marges de splash : https://developer.android.com/reference/androidx/core/splashscreen/SplashScreen (canvas 288 dp, cercle sûr 192 dp ; notre logo complet occupe au maximum un carré de 128 dp).

## Vérifications réalisées

- Transparence du logo, placement dans la zone sûre et inspection du rendu sur blanc : réussis. Aperçu technique, pas une capture de téléphone.
- Fichiers des icônes de lancement comparés au checkpoint précédent, puis ressources mipmap comparées entre les deux APK : identiques.
- Test navigateur avec pont Android simulé : animation active au milieu de la période, durée de 3 058 ms, bouton Quitter relié au pont, présent une seule fois après navigation dans chacun des 14 modules. Absent de la version navigateur.
- Tests des adaptateurs : persistance navigateur, JSON aller-retour, import invalide, annulations/erreurs de sauvegarde et impression : réussis. Aucune erreur JavaScript ni requête externe.
- Annuler et Quitter : branches natives inspectées et compilées. Leur exécution sur Android et la fermeture réelle ne sont pas présentées comme validées sur appareil.
- Compilation GitHub, signature APK v2, version/identifiant, manifeste, DEX, CRC et SHA-256 : réussis. Aucune permission Internet ajoutée.
- HTML embarqué et icône web identiques à ceux du premier APK ; adaptateurs comparés exactement aux blobs du commit compilé. Aucun changement de règle métier, module, schéma de données ou mécanisme JSON.
- BoutiquePilot.html de référence et copie publique inchangés : SHA-256 `4ecb9146067438df0da2fa74e367118dc3e0b28496f5e7fda076fcced4dbb6e5`.

## Livraison et checkpoint

- Commit des corrections compilées : `d423a59884da7056b82483162162254732acb714`.
- Branche : `android/beta`, commit poussé sur GitHub.
- Build réussi : https://github.com/rmshawiri/boutiquepilot/actions/runs/36354858293
- Nouvel APK : `04 Livrables/BoutiquePilot-Android-Beta-2-corrections.apk`.
- Version : `1.0.0-beta.2`, code 2 ; Android 7.0 minimum.
- Taille : 7 464 426 octets.
- SHA-256 : `e99d8108d0a880e3cedde893d05511fa6227e805b4b60c43f7c362c15ebaf346`.
- Preuves séparées : `Beta-2-signature.txt`, `Beta-2-package.txt`, `Beta-2-SHA256SUMS.txt`.
- Ancien APK conservé, empreinte inchangée : `adfdd849e1142d07dcc797f8fed86e9f480d85f23a37590355875b93cedad70f`.

## Deuxième essai demandé

Avant installation, exporter une sauvegarde JSON et la conserver hors de l’application. La signature debug du runner peut différer de celle du premier APK : si Android refuse la mise à jour, ne désinstaller qu’après avoir sécurisé cette sauvegarde, puis installer et réimporter. Une désinstallation efface le stockage local.

Vérifier le premier écran blanc et le logo complet, les trois secondes animées et les transitions ; ouvrir Modules → Quitter l’application, tester Annuler puis Quitter ; relancer et vérifier les données. Vérifier aussi le bouton Retour et un export/import avec les données de démonstration. La procédure générale `03 - Contrôles sur téléphone Android.md` reste applicable.

Aucun nouveau test réel sur téléphone n’a été exécuté par l’assistant. Aucune publication Google Play. Arrêt pour le deuxième test utilisateur.
