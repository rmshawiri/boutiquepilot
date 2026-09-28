# Validation propriétaire — BoutiquePilot Android Bêta 4

**VALIDATION FONCTIONNELLE ANDROID PROPRIÉTAIRE : RÉUSSIE.**

Source : confirmation explicite du propriétaire reçue dans cette conversation le 28 septembre 2026, après essais de Bêta 4 sur son téléphone. Ces résultats sont déclarés par le propriétaire ; ils ne sont pas des tests sur téléphone exécutés par l’assistant. Ils ne constituent pas une approbation Google Play.

| Test réel | Résultat |
|---|---|
| Installation Bêta 3, absence de deuxième icône/application après mise à jour | RÉUSSI |
| Mise à jour Bêta 3 → Bêta 4 par-dessus, sans désinstallation | RÉUSSI |
| Conservation des données après mise à jour | RÉUSSI |
| Fonctionnement hors connexion / mode avion | RÉUSSI |
| Fermeture, arrêt forcé/reprise, relance | RÉUSSI |
| Persistance des données et redémarrage du téléphone | RÉUSSI |
| Sauvegarde Android → JSON → navigateur | RÉUSSI |
| Sauvegarde navigateur → JSON → Android, import/restauration et compatibilité | RÉUSSI |
| Annulation et import invalide | RÉUSSI |
| Impression / PDF | RÉUSSI |
| Quitter l’application / Annuler / Retour Android | RÉUSSI |
| Navigation des 14 modules métier, ergonomie et fonctionnement général | RÉUSSI |
| Splash blanc avec logo complet, écran bleu animé et animation environ 3 secondes | RÉUSSI |

Application validée : com.morashawiri.boutiquepilot, version 1.0.0-beta.4, versionCode 4. Aucun nouveau binaire n’est nécessaire pour enregistrer ces résultats. La signature durable et la continuité des mises à jour ont été confirmées par le scénario réel Bêta 3 → Bêta 4.

Le modèle/version exacte du téléphone et les journaux techniques n’ont pas été fournis ; ne pas extrapoler ces essais à tous les appareils Android. Les contrôles techniques API 24–36 restent documentés séparément.

## Procédure conservée pour les futures versions

La procédure ci-dessous est un protocole de non-régression à réutiliser ; elle n’annule pas les résultats réussis ci-dessus.

## Mise à jour à reproduire pour une future version

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

## Compte rendu à réutiliser pour une future version

La validation Bêta 4 ci-dessus est acquise. Pour une future version, renseigner réussi/échec/non testé et la version Android, puis consigner à nouveau les résultats de mise à jour, mode avion/redémarrage, JSON, impression et sortie. Ne transmettre aucune donnée personnelle.
