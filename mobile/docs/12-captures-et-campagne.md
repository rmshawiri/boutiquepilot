# Captures Android réelles et campagne finale

Statut : **4 captures Android et 4 affiches PNG PRÊTES**, ouvertes et contrôlées visuellement le 28 septembre 2026.

## Provenance Android

APK final Bêta 4 inchangé : 1.0.0-beta.4 / versionCode 4 / com.morashawiri.boutiquepilot. SHA-256 : 6fffb31b80fab08fadf0247df86dc256c6283455f2df854ba65aa3bcb68dd502.

Installation et exécution réelles dans un émulateur Android 15, API 35, x86_64. Acquisition via `adb exec-out screencap -p`, interactions Android avec UIAutomator et gestes ADB. Aucune capture navigateur, aucune modification de l’APK, aucune reconstruction d’interface et aucune image générée par IA.

Exécution : https://github.com/rmshawiri/boutiquepilot/actions/runs/36392107514 . Le transfert de l’APK a utilisé un brouillon GitHub non publié ; aucune clé privée n’a été transférée. Aucun achat, aucune publication Play.

Installation neuve avec la démonstration intégrée uniquement. Aucun compte, contact ou donnée personnelle ajouté. Les noms d’articles et fournisseurs affichés proviennent de la démonstration. Aucun clavier, menu parasite ou indicateur de développement conservé.

Seules les bandes système Android ont été retirées : haut 60 px/bas 60 px en portrait ; haut 36 px/bas 48 px en paysage. Les pixels de l’application dans la zone conservée ont été comparés et sont strictement identiques. PNG RGB 24 bits, sans transparence, sans déformation. Les empreintes des originaux et des résultats figurent dans provenance.json.

## Quatre captures officielles

Dossier : Information clés/07 Application Mobile Bêta/03 Captures App/Captures App/.

| Fichier | Dimensions | Contenu vérifié |
|---|---|---|
| 01-tableau-de-bord.png | 1080 × 1800 | Indicateurs, synthèse et alerte de stock |
| 02-caisse-panier.png | 1080 × 1800 | Sardines à l’huile + Biscuits ABC, quantité 1 chacun, total 250 KMF ; aucune vente encaissée |
| 03-articles-stock.png | 1920 × 996 | Plusieurs articles, stocks, unités de référence, répartition Réserve/Rayon, coûts et statuts |
| 04-tarification-marges.png | 1920 × 996 | Articles/formats, coûts, prix, marges souhaitées et actuelles |

Les tableaux utilisent le rendu paysage réel de l’application pour montrer leurs colonnes. La liste Articles montre les unités de stock ; les formats carton/paquet/détail sont notamment visibles dans Tarification. Aucun montage ne combine artificiellement des vues. Ratios 1,667 et 1,928, dimensions comprises entre 320 et 3840 px et ratio maximal inférieur à 2.

## Quatre affiches finales

Dossier : Information clés/07 Application Mobile Bêta/03 Captures App/Campagne App/.

- 01-tableau-de-bord.png
- 02-caisse-ventes.png
- 03-articles-stock.png
- 04-tarification-marges.png

Chaque PNG est RGB 1080 × 1350. Logo officiel, palette bleu marine/cyan, titre, bénéfice, CTA « Découvrez BoutiquePilot » et vraie capture correspondante. Aucun placeholder, faux avis, statistique promotionnelle inventée, badge Play ou promesse de gratuité permanente. Les montants visibles sont ceux de la démonstration, explicitement identifiée.

SVG éditables dans Campagne App/Sources/ et mobile/resources/campaign-final/. Les anciens modèles ont été retirés des livrables publics et restent dans l’historique Git/les archives locales.

## Reproduction et contrôles

Depuis la racine Git : `node mobile/scripts/finalize-android-captures.mjs DOSSIER_CAPTURES_BRUTES`, puis `node mobile/scripts/campaign-final.mjs`. Les captures brutes proviennent du workflow Android ; la préparation ne touche pas aux pixels métier. La provenance versionnée décrit cette acquisition Bêta 4 précise. Pour une autre acquisition, actualiser ses références et réexaminer les zones système, sans réutiliser aveuglément les valeurs de recadrage.

Les quatre captures et les quatre affiches ont été ouvertes, relues et contrôlées. Journal AndroidRuntime/Capacitor Console sans erreur pendant l’acquisition. Les tests métier lourds acquis n’ont pas été relancés pour les visuels ; les résultats téléphone restent ceux confirmés par le propriétaire.
