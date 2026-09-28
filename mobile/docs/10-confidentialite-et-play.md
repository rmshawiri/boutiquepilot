# Confidentialité et déclarations Google Play

Document préparatoire au 28 septembre 2026. Ne pas soumettre automatiquement ces réponses. Le propriétaire valide les décisions, le texte légal et les coordonnées avant publication.

## Faits techniques vérifiés dans cette version

Pas de permission INTERNET, SDK de publicité, analytics, compte distant, API métier, CDN ou base de données distante. Le Pixel de la landing page n’est pas embarqué dans l’application. Les données de boutique, clients/fournisseurs, ventes, stock et télécom sont stockées localement via localStorage. L’application n’accède pas au carnet d’adresses, à la position, au microphone ou à la caméra. Pas de permission globale de stockage : les fichiers sont choisis explicitement via le sélecteur Android. Sauvegarde automatique Android désactivée.

Les exports JSON sont des fichiers lisibles, non chiffrés par l’application. Ils peuvent contenir les données saisies par l’utilisateur ; conserver ces fichiers de façon privée. L’utilisateur peut choisir un service de transfert ou d’impression externe : ne pas présenter ces services comme entièrement sous le contrôle de BoutiquePilot. Le support par courriel reçoit ce que l’utilisateur lui transmet volontairement, hors de l’application.

## Projet de politique de confidentialité Android

BoutiquePilot Android, édité par MORA Shawiri, fonctionne sur votre appareil. L’application ne transmet pas automatiquement vos données métier à l’éditeur. Elle conserve localement les informations que vous saisissez pour gérer votre boutique. Les données restent jusqu’à leur modification, réinitialisation, effacement du stockage Android ou désinstallation. Exporter régulièrement une sauvegarde est recommandé ; la restauration d’un fichier valide remplace les données courantes.

Vous choisissez les fichiers importés et les emplacements d’export via Android. Vous contrôlez leur transfert et leur conservation. L’impression utilise le service Android choisi. Les règles du fournisseur de transfert ou d’impression s’appliquent à son propre service. N’incluez pas de données personnelles de tiers dans un message de support sans nécessité et autorisation appropriées.

Contact concernant BoutiquePilot : boutiquepilot@morashawiri.com. Ce projet de texte doit être complété/validé par le propriétaire pour ses pratiques réelles de support, durées de conservation des messages, identité juridique et droits applicables.

## Déclarations proposées, sous validation du propriétaire

- Data Safety : l’examen du binaire ne montre aucune collecte/transmission automatique par l’application ni ses bibliothèques. Proposition « aucune donnée collectée/partagée par l’application » à confronter aux définitions et pratiques réelles avant soumission. Le traitement uniquement local n’est pas à confondre avec la transmission au développeur.
- Publicité : aucune publicité dans l’application ; les campagnes externes ne sont pas un SDK publicitaire intégré.
- Accès : pas de login, données de démonstration disponibles. Fournir au reviewer les étapes d’accès hors connexion et aux 14 modules.
- Public cible : usage de gestion commerciale ; tranches d’âge exactes et exclusion/inclusion des enfants à décider par le propriétaire, ne pas cocher automatiquement.
- Classification du contenu : répondre au questionnaire réel (IARC) ; ne pas inventer une classification.
- Fonctionnalités financières : le suivi local de caisse/télécom n’exécute pas de transfert bancaire, de Mobile Money ou de paiement. Le propriétaire doit répondre précisément aux questions affichées dans Play Console.
- Suppression de compte : aucun compte utilisateur créé dans l’application. Effacement des données locales et sauvegardes à expliquer ; ne pas promettre de supprimer un fichier exporté chez un tiers.

## Points empêchant une soumission immédiate

- Confirmer la mise à jour Bêta 3 → Bêta 4 et les scénarios réels documentés.
- Ajouter les quatre vraies captures Android validées.
- Valider et héberger une politique Android sur une URL publique pérenne, non géobloquée ; vérifier son accès et la rendre accessible dans l’application avant soumission. Aucune URL de politique Android non vérifiée n’est inventée ; aucun site n’a été modifié dans cette phase.
- Configurer Play App Signing en conservant le certificat durable si les mises à jour doivent fonctionner entre installations directes et Play. Ne pas choisir une nouvelle clé Google automatiquement sans étudier cette compatibilité. Le keystore privé ne va jamais dans le ZIP Play ; un éventuel transfert chiffré de clé s’effectuera séparément via le procédé officiel Play.
- Vérifier compte développeur, identité, pays, diffusion, prix, obligations éventuelles de test et accès production. Aucune inscription payante effectuée.
- Revalider les politiques au jour du dépôt. Une validation bundletool n’est pas une approbation Google Play.

## Sources officielles consultées

- API cible : https://support.google.com/googleplay/android-developer/answer/11926878 — API 36 exigée pour les nouvelles apps et mises à jour mobiles depuis le 31 août 2026 ; cette version cible 36.
- Confidentialité : https://support.google.com/googleplay/android-developer/answer/10144311 — politique requise et lien/texte dans l’application, même sans collecte sensible.
- Data Safety : https://support.google.com/googleplay/android-developer/answer/10787469
- Comptes personnels récents : https://support.google.com/googleplay/android-developer/answer/14151465 — test fermé d’au moins 12 testeurs inscrits en continu 14 jours si le compte relève de cette règle ; statut du compte non présumé.
- Signature : https://developer.android.com/studio/publish/app-signing
- Assets : https://support.google.com/googleplay/android-developer/answer/9866151
