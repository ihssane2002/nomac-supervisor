# Nomac Supervisor



## Description du projet

Nomac Supervisor est une application de supervision d'une station météo, permettant d'afficher et d'analyser les données météorologiques en temps réel.

## Technologies utilisées

Frontend : React, Tailwind CSS (ou autre framework si utilisé)

Backend : Node.js, Express.js, MongoDB

Base de données : MongoDB (local ou cloud via MongoDB Atlas)


 ## Installation et exécution

1. Cloner le projet

git clone https://github.com/ihssane2002/Nomac-supervisor.git
cd Nomac-supervisor

2. Installer les dépendances

Backend :

cd backend
npm install

Frontend :

cd ../supervision_station_meteo
npm install

3. Lancer le projet

Backend :

cd backend
npm start

Frontend :

cd ../supervision_station_meteo
npm start

## Fonctionnalités principales

1. Récupération et affichage des données météorologiques en temps réel
✔️ Dashboard interactif pour la supervision
✔️ API REST avec Express.js pour récupérer les données depuis MongoDB
✔️ Interface moderne et réactive avec React

2.Améliorations futures

- Ajout de graphiques pour visualiser l'évolution des mesures
- Intégration d'un système d'alertes pour les seuils critiques
- Optimisation des performances et sécurisation de l'API

3. Configuration

Variables d'environnement

Crée un fichier .env dans le dossier backend/ et ajoute les paramètres suivants :

PORT=5000
MONGO_URI=your_mongodb_connection_string



