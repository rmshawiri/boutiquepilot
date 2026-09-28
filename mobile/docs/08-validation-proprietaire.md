# Dernière validation propriétaire — Bêta 3 → Bêta 4

Ne pas désinstaller Bêta 3. Les observations déjà confirmées sont : installation, icône officielle, écran blanc/logo complet, écran animé bleu et lancement normal. Les autres contrôles ne sont pas présumés réussis.

## Mise à jour : critère bloquant

1. Sur Bêta 3, utiliser uniquement la démonstration. Nommer la boutique « Validation mise à jour », créer un client reconnaissable et une vente. Noter total/stock, conserver un export JSON hors de l’application.
2. Installer `BoutiquePilot-Android-1.0.0-beta.4.apk` par-dessus. Android doit proposer/accepter une mise à jour, sans désinstallation ni seconde icône. En cas de refus, arrêter ce scénario et signaler le message exact ; ne pas effacer les données.
3. Ouvrir Bêta 4 ; retrouver boutique, client, vente, stock et paramètres. Exporter un JSON pour comparer les données : le compteur d’export peut augmenter normalement. Confirmer version 1.0.0-beta.4 dans les informations Android de l’application.

## Hors connexion et persistance

Créer/modifier une donnée, fermer, forcer l’arrêt depuis Android, activer mode avion et désactiver Wi-Fi. Relancer, vérifier les données, réaliser une vente, fermer/reprendre. Redémarrer le téléphone puis relancer toujours sans réseau. Les deux opérations et les paramètres doivent persister.

## Sauvegardes réelles

Android → exporter dans un dossier local, vérifier l’existence de `BoutiquePilot_SAUV_JJ-MM-AAAA_XX.json`, transférer puis importer dans une instance navigateur de test. Comparer clients, produits, stocks, ventes, totaux et paramètres.

Navigateur → ajouter une donnée identifiable, exporter, transférer le JSON intact au téléphone et importer dans Android ; fermer/relancer et retrouver les mêmes données. Sauvegarder avant tout import : l’import valide remplace l’état courant.

Annuler chaque sélecteur ; importer un JSON invalide ; vérifier que les données restent intactes. Si un dossier interdit ou un fichier devenu inaccessible permet de simuler une erreur, vérifier le message et la conservation de l’état sans utiliser de données réelles.

## Impression, sortie et ergonomie

Ouvrir un ticket → Imprimer → service Android → enregistrer en PDF si disponible. Vérifier le contenu, puis annuler une autre impression et revenir à l’application.

Modules → Quitter l’application : Annuler laisse l’application ouverte ; Quitter ferme l’activité. Relancer et retrouver les données. Le bouton Retour doit fermer liste/modale/menu avant de mettre l’application en arrière-plan.

Vérifier 14 modules, caisse, rapports, paramètres, portrait/paysage, clavier, barres système et transitions. L’animation normale dure environ 3 secondes ; le réglage de réduction des mouvements est respecté.

## Retour attendu

Renseigner pour chaque groupe : réussi/échec/non testé, version Android et problème observé. Les résultats réels de mise à jour, mode avion/redémarrage, JSON, impression et sortie conditionnent la validation finale. Ne transmettre aucune donnée personnelle.
