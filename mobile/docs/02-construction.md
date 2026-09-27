# Construction Android — journal des checkpoints

Le propriétaire a confirmé de poursuivre sans téléphone USB, de produire l'APK testable, puis de lui laisser les tests utilisateur finaux sur appareil. Il a autorisé une nouvelle clé de signature locale protégée. Les preuves sur téléphone restent distinctes des simulations navigateur.

## Lot enveloppe et adaptateurs

- Capacitor 8.5.2 installé avec lockfile ; Android API min 24, cible 36.
- Bêta source SHA-256 inchangée. Deux injections de ressources locales seulement autour du HTML ; contrôle réversible exact.
- Icône Android issue de l'original, sans redessin. Splash Android et transition HTML locale de moins d'une seconde, mouvement réduit pris en compte.
- Import/export Storage Access Framework ; texte JSON transmis sans modification ; validations et confirmation de l'application d'origine réutilisées.
- Annulation et erreur d'écriture séparées de la réussite. Taille maximale de lecture native 32 Mio (protection mémoire), format JSON inchangé.
- Tickets : PrintManager ; retour Android : fermer la modale/le menu, sinon mettre l'application en arrière-plan.
- localStorage conservé, origine interne fixe ; pas d'Internet ni de permission globale fichiers ; sauvegarde Android automatique désactivée.
- Release : signature fournie par environnement uniquement ; aucune clé ou mot de passe versionné.

## Vérifications déjà effectuées

- Contrôle statique d'identité de la source et absence de dépendance réseau : réussi.
- 14 scénarios métier : conversions, ventes, transferts, poids, coûts historiques, inventaire, promotions, télécom, sauvegardes, atomicité, données invalides, démonstration : réussis.
- 9 scénarios d'intégrité : migration historique, CMP, lots/transferts, conversions invalides, corruption JSON, quota, concurrence et compteurs : réussis.
- Navigateur mobile avec pont natif simulé : 14 modules, lancement, persistance au rechargement, export/import bidirectionnel et égalité des données, import invalide conservant les données, annulation/erreur d'export, adaptation impression : réussis. Aucune requête externe ni erreur JavaScript.
- Exclusions Git des clés, builds, assets générés et configuration locale vérifiées.

Ces tests ne remplacent pas l'installation, le vrai sélecteur Android, le mode avion ou le redémarrage d'un téléphone. Compilation et signature à vérifier au checkpoint suivant.
