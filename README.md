# BoutiquePilot — site officiel

Vitrine statique de MORA Shawiri. Phase 2 : interface et accès à la bêta. Le formulaire est volontairement désactivé ; aucun envoi SMTP ni collecte de bêta-testeurs n’est implémenté.

## Développement

Node.js 22 ou supérieur. Dans ce dossier :

```sh
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:4173. Le serveur écoute uniquement sur l’interface locale et ne sert que `public/`. Les requêtes autres que GET/HEAD sont rejetées.

```sh
npm run check
npm test
```

Le test navigateur nécessite le serveur actif et Chrome installé (`channel: chrome`). Il vérifie navigation, galerie, accès bêta, absence de débordement, erreurs navigateur, fonctionnement sans JavaScript et audit axe WCAG A/AA. Les résultats et captures de contrôle sont dans `artifacts/qa/` (non versionnés). Ces contrôles ne certifient pas une conformité exhaustive.

## Structure

- `public/index.html` : contenu, SEO, sections Accueil / À propos / Contact.
- `public/styles.css` : styles, responsive, focus, réduction des animations.
- `public/app.js` : menu, galerie, présélection du sujet. Aucune requête réseau applicative.
- `public/assets/` : logos adaptés et captures réelles compressées en WebP.
- `public/beta/BoutiquePilot.html` : copie binaire immuable du produit validé.
- `scripts/check.mjs` : intégrité et contrôles statiques sans transformation.
- `scripts/assets.mjs` : création des assets manquants depuis les références locales ; n’écrase pas les assets existants.
- `scripts/serve.mjs` : aperçu local.
- `tests/site.mjs` : contrôles navigateur.
- `vercel.json` : sortie `public/`, route `/beta/`, en-têtes de base.

## Règle absolue d’intégrité

Ne jamais éditer, reformater, minifier ou transformer `public/beta/BoutiquePilot.html` ni la référence `../01 Notre Outil/BoutiquePilot.html`.

SHA-256 attendu, relevé en Phase 1 :

```text
93007be8d597940ee10e6ec4be1dc25a25eec7f7b03978201c83fce111a464be
```

`.gitattributes` désactive toute conversion de fins de ligne pour la copie de la bêta. `npm run build` vérifie cette empreinte, y compris sur Vercel où la référence extérieure au dépôt n’existe pas. Aucun build ne réécrit ce fichier.

## Assets et captures

`npm run assets` nécessite les dossiers voisins officiels `01 Notre Outil` et `03 Logos`. Cette commande ne sert pas au build de déploiement : les fichiers publics nécessaires sont versionnés. Les captures ont été prises dans un navigateur isolé à partir de la copie exacte, avec ses données de démonstration, sans retouche de l’interface. Seule la compression WebP est appliquée. Les PNG source de travail se trouvent dans `artifacts/product/` ; les captures officielles de communication seront sélectionnées lors de la phase dédiée.

La carte de partage est une composition du logo officiel sur fond clair. Aucune identité graphique source n’est modifiée. Les polices sont celles du système, sans service externe.

## Phase 3, après validation explicite

Prévoir `api/contact` Node.js et Nodemailer, validation serveur, Reply-To contrôlé, expéditeur/destinataire fixes, honeypot et limitation distribuée Vercel. Ne retirer `disabled` du formulaire qu’une fois le parcours réel implémenté et testé. Ne jamais simuler une confirmation d’envoi.

Noms des variables prévues (aucune valeur ici) : `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `CONTACT_RECIPIENT`.

La décision concernant la collecte des bêta-testeurs doit être reçue avant la Phase 3. Aucun schéma, stockage ou champ supplémentaire n’est anticipé dans ce projet. Supabase, authentification et paiements sont hors périmètre.

## Publication ultérieure

Pas de publication en Phase 2. Vérifier le contenu du dépôt distant avant le premier push. Lier le dépôt à Vercel (racine du dépôt = ce dossier), utiliser `npm run build` et le dossier public configuré. Tester les réécritures et en-têtes sur le vrai déploiement ; le serveur local ne remplace pas Vercel.

Les métadonnées ciblent `https://boutiquepilot.morashawiri.com/`. Vérifier le domaine, ses DNS et HTTPS avant lancement. Les previews doivent être exclues de l’indexation au niveau de l’hébergement. La bêta est exclue via robots.txt et X-Robots-Tag.

## Secrets et données

Le fichier des comptes reste hors du dépôt et hors de la racine publique. Ne jamais le copier ici. Aucun `.env` n’est nécessaire en Phase 2. `.env*`, `.vercel`, les dépendances et les artefacts de contrôle sont exclus de Git.

L’application utilise le stockage local, lié à l’origine et au navigateur. Fichier local, aperçu local, preview et domaine officiel ne partagent pas automatiquement les données. Utiliser export/import pour les transférer et conseiller des sauvegardes régulières. Le site vitrine ne modifie pas ce stockage.

Les coordonnées publiques proviennent exclusivement du fichier officiel. Les liens sociaux retenus sont Facebook, Instagram et LinkedIn. La disponibilité distante de ces profils reste à revérifier avant publication.
