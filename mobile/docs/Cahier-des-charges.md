# CAHIER DES CHARGES — BOUTIQUEPILOT ANDROID BÊTA

## 1. IDENTIFICATION DU PROJET

**Produit :** BoutiquePilot  
**Version :** Application Android — Bêta  
**Éditeur :** MORA Shawiri  
**Plateforme cible :** Android  
**Distribution cible :** Google Play Store  
**Application source :** version actuellement validée de BoutiquePilot  
**Principe :** fonctionnement local et hors connexion

---

# 2. OBJECTIF DU PROJET

Créer une véritable application Android de BoutiquePilot à partir de la version existante et validée.

L'application Android ne doit pas constituer une reconstruction fonctionnelle de BoutiquePilot et ne doit pas introduire une nouvelle version métier du produit.

Le principe fondamental est :

> BoutiquePilot Android = BoutiquePilot actuel, avec les mêmes fonctionnalités, règles métier, données, calculs et comportements, transformé en application Android autonome et utilisable hors connexion.

Aucune fonctionnalité métier ne doit être ajoutée.

Aucune fonctionnalité métier ne doit être supprimée.

Aucune règle métier ne doit être modifiée.

Seules sont autorisées :

- les adaptations techniques strictement nécessaires à Android ;
- les adaptations nécessaires au fonctionnement hors connexion ;
- les adaptations nécessaires à la persistance locale ;
- les adaptations nécessaires à l'import/export des fichiers ;
- les adaptations strictement nécessaires à une bonne utilisation sur smartphone ;
- l'intégration de l'icône officielle ;
- la création d'une expérience visuelle premium au lancement de l'application.

---

# 3. SOURCE DE RÉFÉRENCE

Codex doit partir exclusivement de la dernière version officielle et validée de BoutiquePilot présente dans le projet.

Avant toute modification :

1. identifier précisément le fichier BoutiquePilot de référence ;
2. vérifier l'état Git du projet ;
3. relever le commit de référence ;
4. calculer le SHA-256 du fichier BoutiquePilot de référence ;
5. créer un checkpoint Git durable avant le début des modifications Android ;
6. vérifier réellement que ce checkpoint existe.

Il est interdit de repartir d'une ancienne copie, d'une ancienne livraison ou d'une reconstruction approximative.

La version source doit rester identifiable pendant toute la durée du développement Android.

---

# 4. PRINCIPE « NI PLUS, NI MOINS »

La version Android doit conserver toutes les fonctionnalités actuellement présentes dans BoutiquePilot.

Il est interdit de :

- supprimer une fonctionnalité ;
- ajouter une fonctionnalité métier ;
- simplifier une règle métier ;
- modifier un calcul ;
- changer volontairement le comportement des données ;
- modifier les données de démonstration ;
- changer les règles de stock ;
- changer les règles de caisse ;
- changer les règles de tarification ;
- changer les règles de marge ;
- changer les règles d'inventaire ;
- changer les règles de rapports ;
- modifier arbitrairement les conditionnements ;
- modifier les règles liées aux dépenses ;
- modifier les règles liées aux clients ou fournisseurs ;
- modifier les règles liées aux télécommunications ;
- introduire une dépendance cloud pour faire fonctionner l'application.

Toute adaptation technique nécessaire à Android doit préserver le résultat fonctionnel de la version navigateur.

---

# 5. ARCHITECTURE ANDROID

L'objectif prioritaire est de réutiliser au maximum le code existant de BoutiquePilot.

Codex doit étudier l'architecture actuelle avant de choisir définitivement la méthode d'intégration Android.

Capacitor peut être utilisé s'il constitue la solution appropriée.

Une autre approche peut uniquement être retenue si elle est techniquement mieux adaptée tout en respectant intégralement ce cahier des charges.

L'application ne doit PAS être une simple WebView dépendante du site public BoutiquePilot.

Les ressources nécessaires au fonctionnement de BoutiquePilot doivent être embarquées localement dans l'application Android.

L'application ne doit pas dépendre de :

- boutiquepilot.morashawiri.com ;
- une API distante ;
- un serveur MORA Shawiri ;
- Supabase ;
- Firebase ;
- un CDN ;
- une base de données distante ;
- une connexion Internet permanente.

---

# 6. FONCTIONNEMENT HORS CONNEXION — EXIGENCE BLOQUANTE

Après téléchargement et installation depuis Google Play, BoutiquePilot doit pouvoir être utilisé sans connexion Internet.

Le fonctionnement hors connexion constitue une exigence fondamentale et bloquante.

Le scénario suivant doit fonctionner :

1. télécharger et installer BoutiquePilot ;
2. lancer l'application ;
3. utiliser BoutiquePilot ;
4. créer et modifier des données ;
5. fermer complètement l'application ;
6. désactiver le Wi-Fi ;
7. désactiver les données mobiles ;
8. activer le mode avion ;
9. relancer BoutiquePilot ;
10. utiliser normalement les différents modules ;
11. fermer de nouveau l'application ;
12. redémarrer l'application ;
13. retrouver les données enregistrées.

L'absence de connexion ne doit pas empêcher le fonctionnement des fonctionnalités métier locales.

Aucun écran blanc, erreur réseau bloquante ou chargement infini ne doit apparaître simplement parce que le téléphone est hors connexion.

---

# 7. DONNÉES ET PERSISTANCE LOCALE

Les données de BoutiquePilot doivent rester stockées localement sur l'appareil, conformément à la philosophie actuelle du produit.

Les données doivent survivre :

- à la fermeture de l'application ;
- au retrait de l'application des applications récentes ;
- à un redémarrage normal de l'application ;
- au passage hors connexion ;
- au redémarrage du téléphone.

Codex doit vérifier le comportement réel du stockage utilisé par BoutiquePilot dans l'environnement Android.

Aucune migration vers une base cloud ne doit être réalisée dans cette version.

---

# 8. COMPATIBILITÉ DES SAUVEGARDES WEB ↔ ANDROID

Cette exigence est obligatoire et bloquante.

BoutiquePilot Android et BoutiquePilot navigateur doivent utiliser un format de sauvegarde compatible.

## 8.1 Android vers navigateur

Une sauvegarde JSON exportée depuis BoutiquePilot Android doit pouvoir être importée directement dans la version navigateur de BoutiquePilot.

Le processus ne doit nécessiter :

- aucune conversion manuelle ;
- aucune modification du JSON ;
- aucun outil externe ;
- aucune transformation intermédiaire.

## 8.2 Navigateur vers Android

Une sauvegarde JSON exportée depuis la version navigateur de BoutiquePilot doit pouvoir être importée directement dans BoutiquePilot Android.

Les données restaurées doivent conserver leur intégrité.

## 8.3 Format

Le format de sauvegarde existant de BoutiquePilot constitue la référence.

Codex ne doit pas créer un format de sauvegarde spécifique à Android si cela casse la compatibilité avec la version navigateur.

La convention actuelle de nommage doit être conservée :

`BoutiquePilot_SAUV_JJ-MM-AAAA_XX.json`

## 8.4 Tests obligatoires

Tester réellement :

### Test A
Android → export JSON → navigateur → import JSON → vérification des données.

### Test B
Navigateur → export JSON → Android → import JSON → vérification des données.

Ces tests doivent porter sur un jeu de données suffisamment représentatif pour vérifier l'intégrité réelle des informations.

Si l'un de ces deux tests échoue, la version Android ne peut pas être considérée comme prête pour livraison.

---

# 9. EXPORT ET IMPORT SUR ANDROID

Les fonctions existantes de sauvegarde/restauration doivent rester accessibles depuis Android.

L'utilisateur doit pouvoir :

- générer une sauvegarde ;
- télécharger/enregistrer le fichier JSON sur son appareil ;
- retrouver le fichier ;
- sélectionner un fichier JSON compatible ;
- importer/restaurer cette sauvegarde.

Les éventuelles adaptations nécessaires aux permissions, au sélecteur de fichiers ou au stockage Android doivent être limitées à ce qui est techniquement indispensable.

Elles ne doivent pas changer le format métier de la sauvegarde.

---

# 10. EXPÉRIENCE DE LANCEMENT PREMIUM

La version Android doit proposer une expérience de lancement plus premium que l'ouverture brute d'une page HTML.

Cette expérience constitue une adaptation visuelle Android autorisée et non une nouvelle fonctionnalité métier.

## Objectif

Lors du lancement, l'utilisateur doit immédiatement percevoir BoutiquePilot comme une application professionnelle, moderne et soignée.

L'effet recherché est :

> « Waouh, c'est propre et professionnel. »

## Principes

Créer une expérience de démarrage :

- élégante ;
- moderne ;
- premium ;
- fluide ;
- cohérente avec BoutiquePilot ;
- suffisamment courte pour ne pas ralentir inutilement l'utilisateur.

Elle peut comporter :

- l'icône ou le logo BoutiquePilot ;
- une animation élégante ;
- une apparition progressive ;
- un mouvement subtil ;
- une transition vers l'application ;
- un fond cohérent avec l'identité BoutiquePilot ;
- des micro-animations professionnelles.

Éviter :

- les animations excessives ;
- les animations longues ;
- les effets gadgets ;
- les écrans surchargés ;
- les dépendances Internet ;
- les vidéos distantes ;
- les ressources chargées depuis un serveur.

Toutes les ressources nécessaires à cette expérience doivent être embarquées localement.

L'écran de lancement ne doit pas modifier les fonctionnalités métier de BoutiquePilot.

---

# 11. ICÔNE DE L'APPLICATION

L'icône officielle est déjà disponible dans :

`07 Application Mobile Bêta/02 Icône App/`

Codex doit utiliser cette icône comme référence officielle.

Ne pas créer une nouvelle identité visuelle et ne pas remplacer arbitrairement cette icône.

Les déclinaisons techniques Android nécessaires peuvent être générées à partir de l'icône officielle.

---

# 12. INTERFACE MOBILE

L'application doit être agréable à utiliser sur smartphone.

L'objectif n'est PAS de refaire le design de BoutiquePilot.

Codex peut uniquement effectuer les adaptations indispensables lorsqu'un élément existant pose un véritable problème d'utilisation sous Android.

Les éléments suivants doivent être vérifiés :

- lisibilité ;
- navigation ;
- menus ;
- champs de formulaire ;
- listes déroulantes ;
- boutons ;
- tableaux ;
- fenêtres modales ;
- caisse ;
- saisie numérique ;
- défilement ;
- clavier Android ;
- orientation et dimensions d'écran pertinentes ;
- zones tactiles ;
- absence de débordements bloquants.

Toute modification doit rester minimale et justifiée par une incompatibilité Android réelle.

---

# 13. APPLICATION AUTONOME

BoutiquePilot Android doit être autonome.

Une fois installée, l'application ne doit pas charger sa logique métier depuis le site BoutiquePilot.

Le site public peut continuer d'exister indépendamment.

Les deux produits doivent donc pouvoir coexister :

- BoutiquePilot navigateur ;
- BoutiquePilot Android.

Une panne ou une indisponibilité du site public ne doit pas rendre l'application Android inutilisable.

---

# 14. VERSION BÊTA

L'application créée dans ce projet constitue la version Android Bêta de BoutiquePilot.

Elle doit être suffisamment stable pour être distribuée à des utilisateurs réels.

Le terme « Bêta » ne doit pas servir à justifier :

- des pertes de données ;
- des fonctionnalités cassées ;
- un mode hors connexion défaillant ;
- des erreurs majeures ;
- une sauvegarde incompatible ;
- des crashs reproductibles.

---

# 15. TESTS FONCTIONNELS

Codex doit tester les fonctionnalités existantes de manière ciblée et économique.

Les tests doivent notamment vérifier les zones stratégiques de BoutiquePilot, dont les modules et comportements existants liés à :

- tableau de bord ;
- caisse ;
- articles ;
- stock ;
- réceptions ;
- mouvements ;
- ventes ;
- tickets ;
- clients ;
- fournisseurs ;
- tarification ;
- marges ;
- promotions ;
- conditionnements ;
- produits pondérés ;
- inventaire ;
- dépenses ;
- télécom ;
- rapports ;
- paramètres ;
- sauvegarde ;
- restauration.

Les tests doivent confirmer que la transformation Android n'a pas modifié les règles métier existantes.

---

# 16. TESTS HORS CONNEXION

Une série spécifique de tests doit être réalisée sans connexion Internet.

Tester notamment :

- lancement hors connexion ;
- relancement hors connexion ;
- navigation ;
- consultation des données ;
- création de données ;
- modification de données ;
- ventes ;
- mouvements de stock ;
- calculs ;
- rapports locaux ;
- persistance ;
- sauvegarde ;
- import lorsque le fichier est présent localement.

Le test final doit inclure un véritable mode avion.

---

# 17. TESTS DE PERSISTANCE

Créer un jeu de données identifiable.

Ensuite :

1. enregistrer les données ;
2. fermer BoutiquePilot ;
3. forcer l'arrêt si pertinent ;
4. relancer ;
5. vérifier les données ;
6. redémarrer le téléphone ou l'émulateur lorsque possible ;
7. relancer ;
8. vérifier de nouveau les données.

Toute perte inexpliquée constitue un problème bloquant.

---

# 18. TESTS DE NON-RÉGRESSION

Comparer les résultats de la version Android avec la version BoutiquePilot de référence.

Vérifier en particulier les calculs importants.

L'objectif n'est pas d'améliorer les calculs existants.

L'objectif est de vérifier qu'Android produit les mêmes résultats que la version de référence.

---

# 19. OPTIMISATION DES TESTS

Les tests de développement doivent être raisonnés et optimisés.

Éviter :

- les compilations Android longues répétées inutilement ;
- les tests complets après chaque changement mineur ;
- les reconstructions coûteuses sans nécessité ;
- les opérations répétitives n'apportant aucune nouvelle information.

Privilégier :

- tests ciblés pendant le développement ;
- tests plus larges aux checkpoints importants ;
- test complet avant livraison.

La réduction des tests ne doit cependant jamais compromettre la fiabilité de la livraison.

---

# 20. GESTION DU TRAVAIL ET CHECKPOINTS

Le projet ne doit pas dépendre uniquement d'un environnement de travail temporaire.

Avant toute opération importante :

- vérifier Git ;
- sauvegarder le travail ;
- créer un commit/checkpoint lorsque nécessaire.

Après chaque lot fonctionnel important :

1. exécuter les tests concernés ;
2. enregistrer les modifications ;
3. créer un commit Git clair ;
4. vérifier réellement que le commit existe.

Avant une compilation Android longue ou une opération potentiellement risquée, créer un checkpoint durable si du travail non sécurisé existe.

Ne jamais laisser plusieurs heures de développement uniquement dans l'espace de travail temporaire.

---

# 21. NOMBRE D'ÉTAPES DU PROJET

Le projet doit rester simple.

Il est organisé en trois grandes étapes seulement.

## ÉTAPE 1 — Audit et préparation

- identifier la référence officielle ;
- calculer le SHA-256 ;
- vérifier Git ;
- créer le checkpoint initial ;
- analyser la compatibilité Android ;
- préparer l'architecture.

## ÉTAPE 2 — Construction Android

- intégrer BoutiquePilot ;
- configurer Android ;
- embarquer toutes les ressources nécessaires ;
- intégrer l'icône ;
- créer l'expérience de lancement premium ;
- assurer le stockage local ;
- assurer import/export ;
- assurer le fonctionnement hors connexion ;
- effectuer les adaptations Android strictement nécessaires ;
- compiler ;
- tester ;
- corriger les problèmes relevant de la transformation Android ;
- effectuer les tests Web ↔ Android des sauvegardes.

## ÉTAPE 3 — Livraison et préparation Google Play

- tests finaux ;
- APK final de contrôle ;
- AAB signé pour Google Play ;
- captures réelles de l'application ;
- visuels de campagne ;
- rapport final ;
- préparation des éléments nécessaires à la publication Play Store.

Ces trois étapes n'empêchent pas Codex d'utiliser plusieurs commits/checkpoints internes.

---

# 22. STRUCTURE DES DOSSIERS

Le dossier de travail documentaire/livraison est :

`07 Application Mobile Bêta/`

Structure :

07 Application Mobile Bêta/
│
├── 01 Cahier de charge App/
│   └── Cahier des charges - BoutiquePilot Android Beta.md
│
├── 02 Icône App/
│   └── icône officielle
│
├── 03 Captures App/
│   ├── Captures App/
│   └── Campagne App/
│
├── 04 Livrables/
│
└── 05 Rapports App/

Respecter cette organisation.

Ne pas disperser les livrables finaux dans des emplacements arbitraires.

---

# 23. CAPTURES GOOGLE PLAY

Le dossier :

`07 Application Mobile Bêta/03 Captures App/Captures App/`

doit recevoir exactement 4 captures représentatives de la véritable application Android.

Il ne s'agit pas de maquettes fictives.

Les captures doivent provenir de l'application fonctionnelle.

Codex choisira quatre écrans stratégiques qu'il juge particulièrement représentatifs de la valeur de BoutiquePilot.

Les captures doivent :

- être propres ;
- être lisibles ;
- présenter correctement l'application ;
- éviter les données personnelles réelles ;
- être adaptées à une utilisation future dans la fiche Google Play.

Ne pas modifier artificiellement l'interface dans le seul but d'obtenir les captures.

---

# 24. CAMPAGNE APPLICATION

Le dossier :

`07 Application Mobile Bêta/03 Captures App/Campagne App/`

doit recevoir exactement 4 affiches publicitaires consacrées à BoutiquePilot Android.

Ces affiches doivent promouvoir l'application réelle.

Elles doivent respecter :

- l'identité BoutiquePilot ;
- l'identité MORA Shawiri lorsque pertinente ;
- un rendu professionnel ;
- une excellente lisibilité ;
- des textes courts ;
- l'absence de promesses mensongères ;
- l'absence de statistiques inventées ;
- l'absence de témoignages fictifs.

Les affiches peuvent exploiter les véritables captures de l'application.

Elles ne doivent pas présenter des fonctionnalités inexistantes.

---

# 25. LIVRABLES

Le dossier :

`07 Application Mobile Bêta/04 Livrables/`

doit contenir les livrables utiles au projet.

Au minimum, lorsque techniquement prêts :

- APK Android final destiné aux tests/contrôles ;
- AAB signé destiné à Google Play.

Ajouter uniquement les autres fichiers réellement utiles à la livraison.

Éviter d'encombrer ce dossier avec :

- caches ;
- builds temporaires ;
- fichiers intermédiaires ;
- journaux inutiles ;
- doublons.

---

# 26. SIGNATURE ANDROID

La version destinée à Google Play doit être correctement signée.

Les éléments sensibles de signature ne doivent jamais être :

- publiés dans Git ;
- exposés dans les rapports ;
- copiés dans les captures ;
- stockés dans le code source public ;
- révélés dans les logs.

Toute donnée sensible doit être traitée comme confidentielle.

---

# 27. GOOGLE PLAY

La cible finale est la publication de BoutiquePilot sur Google Play.

Le livrable de publication doit être un Android App Bundle (AAB) conforme aux exigences applicables de Google Play au moment de la publication.

Ne pas inventer les informations administratives ou commerciales demandées par Google Play.

Si une information doit être fournie par le propriétaire du compte Google Play, la signaler clairement.

Ne pas publier définitivement une version publique sans validation explicite du propriétaire du projet.

---

# 28. RAPPORTS

Le dossier :

`07 Application Mobile Bêta/05 Rapports App/`

est destiné aux rapports importants du développement Android.

Les rapports doivent servir de trace durable.

Ils peuvent notamment documenter :

- référence source ;
- architecture retenue ;
- adaptations Android effectuées ;
- commits/checkpoints ;
- tests ;
- fonctionnement hors connexion ;
- persistance ;
- compatibilité des sauvegardes ;
- APK/AAB ;
- résultats de validation ;
- problèmes éventuels ;
- état de préparation Google Play.

Éviter la multiplication de rapports inutiles.

Un rapport doit correspondre à un véritable jalon ou à la livraison finale.

---

# 29. SÉCURITÉ ET CONFIDENTIALITÉ

Ne jamais exposer :

- mots de passe ;
- tokens ;
- secrets ;
- clés privées ;
- clés de signature ;
- identifiants confidentiels ;
- fichiers de comptes ;
- informations sensibles contenues dans les fichiers locaux du projet.

Les fichiers contenant des informations de comptes ne doivent pas être intégrés dans l'application ni publiés dans Git.

---

# 30. RESSOURCES DISTANTES

Codex doit auditer les éventuelles ressources distantes utilisées par BoutiquePilot.

Si une ressource indispensable à l'utilisation normale nécessite Internet, elle doit être traitée de manière à respecter l'exigence hors connexion, sans modifier l'identité ou la logique fonctionnelle du produit.

Ne pas ajouter de nouvelles dépendances réseau inutiles.

---

# 31. COMPORTEMENT EN ABSENCE DE RÉSEAU

Aucune fonction locale ne doit attendre inutilement un réseau.

L'application doit démarrer normalement lorsque :

- le téléphone n'a pas de carte SIM ;
- les données mobiles sont désactivées ;
- le Wi-Fi est désactivé ;
- le mode avion est activé.

Les fonctionnalités strictement locales doivent rester disponibles.

---

# 32. PERMISSIONS ANDROID

Limiter les permissions Android au strict nécessaire.

Ne pas demander une permission simplement « au cas où ».

Toute permission ajoutée doit être justifiée par une fonction réellement existante de BoutiquePilot ou par une nécessité technique de l'application.

Éviter notamment les accès excessifs aux données de l'appareil.

---

# 33. QUALITÉ DE L'APPLICATION

Avant livraison finale, vérifier notamment :

- absence de crash reproductible ;
- absence d'écran blanc ;
- absence de blocage majeur ;
- absence de dépendance réseau cachée ;
- persistance correcte ;
- interface exploitable ;
- import/export opérationnel ;
- compatibilité Web ↔ Android ;
- icône correcte ;
- lancement premium ;
- APK installable ;
- AAB générable/signé ;
- fonctionnement hors connexion réel.

---

# 34. CRITÈRES BLOQUANTS DE LIVRAISON

La livraison Android ne doit PAS être déclarée terminée si l'un des points suivants échoue :

1. l'application ne démarre pas sans Internet ;
2. une fonctionnalité métier existante a été supprimée ;
3. une règle métier a été modifiée involontairement ;
4. les données ne persistent pas correctement ;
5. l'export JSON Android est incompatible avec BoutiquePilot navigateur ;
6. l'export navigateur est incompatible avec BoutiquePilot Android ;
7. l'application dépend du site public pour fonctionner ;
8. un crash majeur reproductible subsiste ;
9. l'APK final ne peut pas être installé ;
10. l'AAB de publication ne peut pas être produit correctement ;
11. une donnée sensible est intégrée ou exposée dans la livraison.

---

# 35. VALIDATION FINALE HORS CONNEXION

Avant la livraison finale :

1. installer une version propre de BoutiquePilot Android ;
2. lancer l'application ;
3. créer un jeu de données ;
4. effectuer plusieurs opérations représentatives ;
5. fermer l'application ;
6. activer le mode avion ;
7. relancer l'application ;
8. vérifier les données ;
9. utiliser plusieurs modules ;
10. effectuer une opération de vente/stock pertinente ;
11. fermer et relancer ;
12. vérifier de nouveau les données ;
13. exporter une sauvegarde JSON ;
14. importer cette sauvegarde dans BoutiquePilot navigateur ;
15. vérifier son intégrité ;
16. exporter une sauvegarde depuis le navigateur ;
17. l'importer dans Android ;
18. vérifier son intégrité.

Documenter les résultats dans le rapport final.

---

# 36. RÈGLE FINALE

Le développement Android doit respecter en permanence cette règle :

> Ne pas profiter de la transformation Android pour refaire BoutiquePilot.

BoutiquePilot existe déjà.

Le travail demandé consiste à transformer cette version validée en une application Android fiable, autonome, professionnelle, agréable à lancer et réellement utilisable hors connexion.

L'utilisateur doit retrouver BoutiquePilot.

Pas une approximation.

Pas une version simplifiée.

Pas une nouvelle application inspirée de BoutiquePilot.

**BoutiquePilot lui-même, sur Android.**