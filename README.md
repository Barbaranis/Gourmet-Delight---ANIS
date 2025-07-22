#  Gourmet Delight

Bienvenue sur **Gourmet Delight**, un projet de site web complet pour un restaurant gastronomique fictif. Ce projet a été conçu dans le cadre d’une soutenance professionnelle afin de mettre en œuvre des compétences en développement web fullstack, design UX/UI, gestion de données et déploiement moderne.

---

##  Objectif du projet

Créer une plateforme numérique haut de gamme qui reflète l’élégance et l’excellence d’un restaurant gastronomique, tout en intégrant une interface d’administration complète pour la gestion quotidienne.

---

##  Présentation du restaurant

**Gourmet Delight** est un restaurant d’exception, imaginé comme une expérience culinaire raffinée portée par trois chefs prestigieux, dans un cadre élégant. Le site valorise l’image du restaurant à travers un design soigné, des animations légères et une interface intuitive.

---

##  Fonctionnalités principales

###  Côté public
- **Page d’accueil dynamique** avec contenu modifiable depuis le back-office
- **Menu élégant** affichant les plats avec image, prix, description et catégorie
- **Chefs en vedette** avec fiches interactives
- **Formulaire de réservation** connecté à Firestore
- **Formulaire de contact** pour envoyer des messages
- **Témoignages clients** visibles directement sur la home page

###  Côté administrateur (dashboard)
- **Gestion des plats** (ajout, modification, suppression, image, catégorie)
- **Gestion des employés** avec rôles et droits distincts
- **Consultation et modération des avis**
- **Consultation des messages de contact**
- **Visualisation des statistiques de réservation par chef**
- **Modification des contenus de la page d’accueil et de la page à propos**
- **Mise à jour dynamique des horaires d’ouverture (footer)**

---

##  Système de rôles

| Rôle                     | Accès principaux                                          |
|--------------------------|-----------------------------------------------------------|
| `admin`                 | Tous les accès                                             |
| `chef_cuisine`          | Gestion des plats                                          |
| `maitre_hotel`          | Supervision globale                                       |
| `responsable_salle`     | Gestion des réservations                                   |
| `gestionnaire_contenu`  | Modification des pages Accueil et À propos                |
| `responsable_avis`      | Validation et suppression des témoignages clients         |
| `responsable_communication` | Accès aux messages de contact                        |

---

##  Stack technique

- **Frontend** : React.js + CSS Modules
- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL via Sequelize ORM
- **Stockage secondaire** : Firebase Firestore (témoignages, messages, contenu dynamique)
- **Authentification** : JWT
- **Déploiement** : Docker (multi-container) + GitHub
- **Versioning** : Git / GitHub (main + branches de dev)

---

##  Arborescence

gourmet-delight/
├── frontend/               # React, pages, composants, styles
├── backend/                # API REST Node.js + PostgreSQL
├── docker-compose.yml      # Déploiement multi-container
├── .env                    # Variables d’environnement (non versionné)
└── .gitignore              # Fichiers ignorés par Git


## Auteur & contexte

Ce projet a été imaginé et développé par Anis Barbaranis dans le cadre d’un ECF . Il a été conçu pour démontrer la maîtrise du développement web moderne, l’organisation d’un projet complet et le déploiement d’une application professionnelle.

