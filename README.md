# BoutiquePilot — site officiel

Vitrine de MORA Shawiri. Phase 3 : formulaire Contact SMTP côté serveur et CTA vers la page WordPress de collecte. Le design validé en Phase 2 est conservé.

## Développement

Node.js 22 ou supérieur. Dans ce dossier :

```sh
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:4173. Le serveur écoute uniquement sur l’interface locale et ne sert que `public/`. La route /api/contact accepte POST ; les fichiers statiques restent limités à GET/HEAD.

```sh
npm run check
npm test
```

Le test navigateur nécessite le serveur actif et Chrome installé (`channel: chrome`). Il vérifie navigation, galerie, accès bêta, absence de débordement, erreurs navigateur, fonctionnement sans JavaScript et audit axe WCAG A/AA. Les résultats et captures de contrôle sont dans `artifacts/qa/` (non versionnés). Ces contrôles ne certifient pas une conformité exhaustive.

## Structure

- `public/index.html` : contenu, SEO, sections Accueil / À propos / Contact.
- `public/styles.css` : styles, responsive, focus, réduction des animations.
- `public/app.js` : menu, galerie, présélection du sujet et soumission du formulaire Contact à /api/contact.
- `public/assets/` : logos adaptés et captures réelles compressées en WebP.
- `public/beta/BoutiquePilot.html` : copie binaire immuable du produit validé.
- `scripts/check.mjs` : intégrité et contrôles statiques sans transformation.
- `scripts/assets.mjs` : création des assets manquants depuis les références locales ; n’écrase pas les assets existants.
- `scripts/serve.mjs` : aperçu local.
- `tests/site.mjs` : contrôles navigateur.
- `api/contact.js` et `server/contact.js` : validation, anti-abus et SMTP côté serveur.
- `tests/contact.test.mjs` et `tests/contact-browser.mjs` : tests Contact sans envoi réel.
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

## Contact SMTP et séparation des parcours

Les cinq CTA d’essai pointent vers https://morashawiri.com/acceder-a-boutiquepilot/. WordPress gère seul Fluent Forms et FluentCRM. La route /beta/ reste disponible techniquement : ce changement de liens ne constitue pas un contrôle d’accès ou une authentification. La redirection finale du formulaire WordPress sera configurée par le propriétaire après disponibilité du domaine officiel.

Le Contact utilise api/contact.js et server/contact.js. Aucun appel à FluentCRM, aucune base de données ni synchronisation. Les champs ne sont pas persistés par le site ; ils sont transmis par e-mail. Le destinataire et l’expéditeur SMTP sont fixes côté serveur. Reply-To contient l’adresse validée du visiteur. Le succès signifie acceptation par SMTP, pas confirmation de lecture ou d’arrivée dans la boîte de réception.

Copier .env.example vers .env.local et renseigner les valeurs SMTP fournies, sans les versionner. Le serveur local charge ce fichier au démarrage ; redémarrer après changement. Aucune variable n’est injectée dans le frontend.

Variables SMTP : SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, CONTACT_RECIPIENT. Port 465 avec TLS implicite ou 587 avec STARTTLS obligatoire ; validation du certificat active, TLS 1.2 minimum. Délais réseau bornés, pas de journal SMTP.

Autres variables : CONTACT_ALLOWED_ORIGINS (origines exactes, séparées par virgule) et CONTACT_FIREWALL_HOST (domaine de confiance, sans protocole). Pour une preview, inscrire explicitement son origine dans la configuration serveur. Ne pas accepter une origine arbitraire provenant du visiteur.

Sécurité : POST JSON uniquement, origine autorisée, corps limité à 24 Kio, nom 2–100 caractères, e-mail au maximum 254, téléphone facultatif au maximum 30, sujet parmi les six choix, message 10–5000, contrôle des caractères interdits, honeypot website, échappement HTML et désactivation des accès fichiers/URL de Nodemailer. Les erreurs publiques sont génériques et les textes saisis sont conservés en cas d’échec. Aucun nouvel essai automatique d’envoi après une erreur réseau, pour limiter les doublons.

### Limitation sur Vercel — activation au déploiement

Le SDK @vercel/firewall exige deux règles configurées dans le projet :

| Identifiant SDK             | Clé                   | Proposition initiale          |
| --------------------------- | --------------------- | ----------------------------- |
| boutiquepilot-contact-ip    | IP fournie par Vercel | 5 tentatives / 900 secondes   |
| boutiquepilot-contact-total | contact-global        | 100 tentatives / 900 secondes |

Configurer la condition @vercel/firewall avec ces identifiants exacts et une action de limitation HTTP 429, fenêtre fixe. Les compteurs sont distribués entre instances mais par région, pas un quota mondial strict. Les erreurs SMTP consomment aussi le quota. Une règle absente, bloquée ou indisponible entraîne un refus sécurisé 503 sans envoi. Vérifier les quotas du plan et le comportement réel en preview avant ouverture publique. La configuration du pare-feu et les variables hébergées ne sont PAS encore activées : aucun déploiement n’a été effectué en Phase 3.

Le serveur de développement local utilise un compteur unique de 5 tentatives / 15 minutes pour son processus. Il ne s’agit PAS de la protection de production. Le mode local est impossible lorsque VERCEL=1 ou NODE_ENV=production. Ne jamais utiliser scripts/serve.mjs comme serveur public.

### Tests Contact

- npm run test:contact : validation, injections, tailles, SMTP simulé, erreurs, fail-closed et compteur local. Aucun e-mail réel.
- npm run test:contact:browser : états attente/succès/erreur/429, validation et conservation des champs avec réponses simulées. Aucun e-mail réel.
- npm test : parcours du site, cinq CTA WordPress, route technique bêta, responsive et axe.

Un seul e-mail réel de contrôle a été envoyé et accepté pendant la Phase 3 (preuve locale artifacts/qa/smtp-live.json). Le propriétaire confirme sa réception en boîte de réception et la bonne mise en forme BoutiquePilot. Il confirme également le parcours WordPress et la création du contact dans la liste BoutiquePilot avec l’étiquette Bêta-testeur BoutiquePilot. Aucun nouvel envoi réel ni changement WordPress n’est nécessaire. Les vérifications DNS et hébergement restent réservées au déploiement.

## Publication ultérieure

Pas de publication en Phase 3. Vérifier le contenu du dépôt distant avant le premier push. Lier le dépôt à Vercel (racine du dépôt = ce dossier), utiliser `npm run build` et le dossier public configuré. Tester les réécritures et en-têtes sur le vrai déploiement ; le serveur local ne remplace pas Vercel.

Les métadonnées ciblent `https://boutiquepilot.morashawiri.com/`. Vérifier le domaine, ses DNS et HTTPS avant lancement. Les previews doivent être exclues de l’indexation au niveau de l’hébergement. La bêta est exclue via robots.txt et X-Robots-Tag.

## Secrets et données

Le fichier des comptes reste hors du dépôt et hors de la racine publique. Ne jamais le copier ici. Le fichier `.env.local` contient uniquement la configuration SMTP locale et reste exclu de Git et du déploiement. `.env*`, `.vercel`, les dépendances et les artefacts de contrôle sont exclus de Git.

L’application utilise le stockage local, lié à l’origine et au navigateur. Fichier local, aperçu local, preview et domaine officiel ne partagent pas automatiquement les données. Utiliser export/import pour les transférer et conseiller des sauvegardes régulières. Le site vitrine ne modifie pas ce stockage.

Les coordonnées publiques proviennent exclusivement du fichier officiel. Les liens sociaux retenus sont Facebook, Instagram et LinkedIn. La disponibilité distante de ces profils reste à revérifier avant publication.

## Qualité — Phase 4

Commande complémentaire : npm run test:quality (serveur local actif). Elle mesure le chargement initial et les déplacements de mise en page avec app.js retardé de 1,5 seconde, vérifie le texte à 200 % et ouvre les 14 modules de la bêta dans un profil isolé sans soumission métier. Ces mesures locales ne sont pas des Core Web Vitals de production. Les preuves restent dans artifacts/qa/phase4-quality.json.

La déclaration JavaScript précoce évite le déplacement initial du menu mobile. Le formulaire conserve les données si une réponse positive ne contient pas la confirmation JSON attendue. Les réponses 413 et positives illisibles sont couvertes par les tests navigateur. Aucun changement de design ni de la bêta.
