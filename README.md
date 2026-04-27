# license-check (v1.0.0)

Système de validation de licences avec **Node-Locking** basé sur Node.js, Express et Sequelize.

## 📝 Description
Ce projet implémente un mécanisme de protection logicielle par verrouillage de nœud (node-locking). Une clé de licence est liée de manière permanente à l'identifiant unique d'une machine (machineId) lors de sa première activation, empêchant ainsi l'utilisation du même code sur plusieurs appareils.

## 🚀 Technologies Utilisées
* **Backend** : Node.js & Express
* **ORM** : Sequelize (v6.37.3)
* **Driver DB** : MySQL2
* **Environnement** : Dotenv

## 📦 Installation

1. **Clonage du projet** :
```bash 
git clone (https://github.com/912i/Licence-Check)
cd license-check
```

2. **Installation des dépendances** :
```bash
npm install
```

3. **Configuration du fichier .env** :
Créez un fichier .env à la racine du projet :
```bash
PORT=3000
MYSQL_URL=mysql://utilisateur:mot_de_passe@localhost:3306/nom_de_la_bdd
```
## 🛠 Utilisation

### Démarrage du serveur
```bash
npm start
```
### API Endpoint : Validation / Activation
**URL** : POST /LSCCUSTOMROUND

**Corps de la requête (JSON)** :
{
  "licenseKey": "VOTRE-CLE-ICI",
  "machineId": "ID-UNIQUE-MACHINE"
}

**Réponses du serveur** :
* 200 OK : Licence activée avec succès ou déjà valide pour cette machine.
* 400 Bad Request : La licence est déjà utilisée par un autre appareil.
* 404 Not Found : La clé de licence n'existe pas.
* 500 Internal Error : Erreur serveur.

## 📊 Structure de la Base de Données
Le modèle License comprend :
* licenseKey : Clé unique.
* machineId : ID de la machine liée.
* isActive : État d'activation.
