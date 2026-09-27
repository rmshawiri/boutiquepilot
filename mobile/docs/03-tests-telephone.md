# BoutiquePilot Android Bêta — contrôle sur téléphone

Cette procédure complète les tests automatisés sur le code et les adaptateurs. Tant qu'elle n'est pas passée, l'APK est une version de contrôle, pas une livraison Android validée pour Google Play.

## Installation et lancement

1. Copier l'APK fourni sur le téléphone, puis l'installer. Android peut demander d'autoriser temporairement l'installation depuis votre gestionnaire de fichiers.
2. Ouvrir BoutiquePilot : icône officielle, lancement bref, tableau de bord et démonstration visibles.
3. Ouvrir Modules ; parcourir les 14 modules, les listes déroulantes, une modale de saisie et le clavier. Vérifier le retour Android : liste/modale/menu se ferme avant la mise en arrière-plan.
4. Essayer portrait et paysage. Vérifier qu'aucun bouton important n'est masqué par les barres système ou le clavier.

## Données et vrai hors connexion

1. Utiliser uniquement la démonstration pour ce contrôle, pas les données réelles de votre boutique.
2. Dans Paramètres, nommer la boutique « Contrôle Android ». Ajouter un client de test.
3. Effectuer une vente simple en notant le produit, le conditionnement, la quantité, le total et le stock avant/après. Consulter son ticket et les rapports.
4. Fermer complètement l'application et forcer son arrêt dans Android. Activer le mode avion, désactiver aussi le Wi-Fi s'il reste actif.
5. Relancer BoutiquePilot. Retrouver le nom, le client et la vente. Faire une autre opération de vente ou de stock hors connexion.
6. Fermer et relancer une deuxième fois. Redémarrer le téléphone, conserver le mode avion et vérifier de nouveau les données.
7. Contrôler les réceptions, transferts, tarifs/promotions, conditionnements, produit au poids, inventaire, dépenses et télécom sur cette démonstration. Comparer les résultats attendus à la version navigateur.

## Android → navigateur

1. Toujours hors connexion, ouvrir Sauvegarde puis Télécharger la sauvegarde.
2. Dans le sélecteur Android, choisir un dossier local (par exemple Téléchargements) et enregistrer. Vérifier le nom `BoutiquePilot_SAUV_JJ-MM-AAAA_XX.json` et retrouver réellement le fichier.
3. Transférer ce fichier, sans le modifier, vers l'ordinateur (USB ou autre moyen choisi).
4. Ouvrir une instance de test de la bêta navigateur. Sauvegarder d'abord ses données si elles sont utiles : un import remplace les données existantes.
5. Importer le fichier. Vérifier nom de boutique, clients, articles, stocks par emplacement, ventes/tickets, tarifs, inventaires, dépenses, télécom et compteurs.

## Navigateur → Android

1. Dans l'instance navigateur de test, ajouter une donnée identifiable puis exporter sa sauvegarde.
2. Copier ce JSON intact dans un dossier local du téléphone.
3. Sur Android en mode avion, Sauvegarde → Importer une sauvegarde. Choisir le fichier et confirmer le remplacement.
4. Retrouver la donnée ajoutée et les mêmes totaux. Fermer, relancer et vérifier encore.
5. Vérifier qu'annuler le sélecteur ne modifie pas les données, et qu'un JSON invalide est refusé sans les effacer.

## Tickets et incidents

Ouvrir une vente, Imprimer le ticket, puis enregistrer en PDF avec le service Android si disponible. Vérifier le contenu du ticket. Annuler une impression et revenir normalement à BoutiquePilot.

Pour signaler un problème : modèle du téléphone, version Android, action exacte, résultat attendu et résultat observé. Ne partager aucun fichier de données réelles ou information confidentielle.

## Captures et publication

Les 4 captures officielles doivent être prises sur l'application Android installée, sans données personnelles : tableau de bord, caisse/panier, articles/stock et tarification/marges. Aucune capture de navigateur ne sera présentée comme une capture Android.

Les 4 affiches de campagne restent à réaliser sur la base de ces captures après validation. Aucun envoi ni publication Google Play n'est autorisé par cette procédure.
