# Play App Signing — préserver l’identité installée

## Identité BoutiquePilot à conserver

Package : com.morashawiri.boutiquepilot. Clé durable locale : boutiquepilot-app, PKCS12 chiffré. Certificat SHA-256 : f8b6ad7afe5f7adf2adae89c353d8b9ddeccd1c01f5de558d5f9fffacc42b597. Cette clé signe les APK directs Bêta 3/Bêta 4 ; leur mise à jour sans désinstallation a été confirmée par le propriétaire.

## Deux rôles distincts

La clé de signature de l’application identifie les APK installés. La clé d’importation authentifie les AAB envoyés à Play ; elle ne détermine pas à elle seule la signature des APK distribués. Une clé d’importation séparée est recommandée. Notre clé durable sert actuellement aux deux formats locaux ; aucune clé d’importation distincte n’a été créée ou enregistrée.

## Sélection à effectuer ensemble dans Play Console

1. Avant diffusion, ouvrir la rubrique de protection Play, puis distribution Play Store et gestion de Play App Signing.
2. Modifier le choix de clé proposé par défaut ; choisir l’option **fournir une copie de sa propre clé de signature**, et non générer une nouvelle identité. Le libellé anglais documenté est « Provide a copy of your app signing key ».
3. Après autorisation explicite, télécharger l’outil PEPK proposé par la console et suivre ses instructions exactes d’export chiffré et de transfert de la clé existante. Aucun mot de passe n’est envoyé dans une conversation ou un rapport ; le keystore brut n’est jamais joint au ZIP Play.
4. Vérifier que le certificat de signature enregistré correspond exactement à l’empreinte BoutiquePilot ci-dessus. Arrêter si la console impose une autre identité ou une rotation non étudiée.
5. Décider séparément de la clé d’importation et enregistrer son certificat public selon la console. Garder la clé BoutiquePilot pour signer les futures installations directes.

Ne valider aucune génération/rotation automatique ni mise en production avant ce contrôle. La documentation actuelle indique que le choix peut être modifié avant une diffusion en test ouvert ou production ; les écrans exacts seront vérifiés dans le compte réel.

## Validation après configuration

Vérifier le certificat des APK effectivement fournis par Play et réaliser un essai direct → Play puis Play → APK direct, avec versions croissantes et données de démonstration conservées. Ne pas conclure à cette compatibilité à partir de la seule signature de l’AAB. Toute modification automatique de signature introduite par Play doit être examinée avant diffusion. La validation Bêta 3 → Bêta 4 est acquise ; la distribution Play n’est pas encore configurée.

Source officielle consultée : https://support.google.com/googleplay/android-developer/answer/9842756 . Aucune opération de clé n’a été exécutée dans Play Console.
