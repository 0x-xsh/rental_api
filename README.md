![image](https://github.com/user-attachments/assets/d1ce5c5f-7210-4e07-bdb8-e380692801a2)
### **Setup**

- **Prérequis :**
  - Docker doit être installé.

- **Démarrez l'APP** :
     ```bash
     docker compose up
     ```

- **Configuration personnalisée (optionnel) :**
  - Modifiez le fichier `.env` pour adapter les variables d'environnement selon vos besoins (base de données, ports, etc.).

# Rapport de l'API

## Contexte

En utilisant le lien initial, j'ai inspecté le code HTML et découvert un JWT caché. J'ai deviné qu'il s'agissait d'un JWT en raison de sa structure, séparée par deux points. Je l'ai ensuite copié et décodé sur jwt.io, ce qui m'a permis de récupérer le paramètre de la requête. Je l'ai ajouté à l'URL suivante : https://djob-website-test.nw.r.appspot.com/. Une fois le challenge débloqué, j'ai pris le temps de lire attentivement les exigences techniques et non techniques.

J'ai ensuite crée rapidement un diagramme UML pour concevoir mon API, en prenant en compte les contrats de données avec les DTO (Data Transfer Objects). Pendant l'analyse, j'ai remarqué qu'il était nécessaire d'ajouter une colonne dans les tables customer et rental. J'ai donc utilisé la commande ALTER TABLE pour effectuer les ajouts requis. À ce stade, la base de données était prête.

Après cela, j'ai réfléchi à la manière de planifier les tâches et de définir leurs dates de lancement correctes en fonction de chaque location. J'ai opté pour une approche simple et efficace. Voici les étapes clés de mon processus :

- **Vérification initiale lors de chaque location :**
  - Vérifier si le client existe dans la base de données.
  - Vérifier si le stock (film) est disponible.

- **Récupération et conversion des dates :**
  - Récupérer la date de début de la location.
  - Récupérer la date de retour de la location.
  - Convertir ces dates en UTC pour standardiser les opérations temporelles.

- **Création des tâches associées :**
  - Créer une tâche planifiée à **J-5** avant la date de retour de la location.
  - Créer une autre tâche planifiée à **J-3** avant la date de retour.
  - Stocker les dates d'échéance des tâches en UTC dans la base de données.

- **Mise en place d'un job cron :**
  - Configurer un job cron qui s'exécute toutes les heures.
  - Objectif :
    - Réduire la surcharge des requêtes fréquentes à la base de données.
    - S'assurer qu'aucune tâche planifiée ne soit manquée.

- **Gestion des cas limites avec les tâches proches :**
  - Si une location est ajoutée juste après une vérification horaire, la tâche la plus proche reste à **J-3** ou **J-5**, garantissant un délai minimum de deux jours avant exécution.
  - Ce mécanisme garantit qu'aucune tâche ne soit omise.

- **Exécution des tâches par le job cron :**
  - Récupérer les tâches avec un statut `pending`.
  - Identifier les tâches dont la date d'échéance correspond à l'heure actuelle du serveur (convertie en UTC).
  - Exécuter ces tâches si elles répondent aux critères.


# API Endpoints Summary

| **Entity**    | **Endpoint**                     | **Method** | **Description**                                   | **Body Parameters**               |
|---------------|----------------------------------|------------|---------------------------------------------------|------------------------------------|
| **Customer**  | /customers                      | POST       | Create a new customer                            | `first_name`, `last_name`, `email`, `store_id`, `activebool`, `active`, `timezone` |
| **Customer**  | /customers/:id                  | PUT        | Update an existing customer by ID                | `first_name`, `last_name`, `email`, `store_id`, `activebool`, `active`, `timezone` |
| **Rental**    | /rentals                        | POST       | Create a new rental                              | `customer_id`, `film_id`, `rental_date`, `return_date`, `timezone` |
| **Task**      | /tasks                          | GET        | List all scheduled tasks                         | None                               |
| **Task**      | /tasks/:id/execute              | POST       | Manually trigger a scheduled task by ID          | None                               |
| **Task**      | /tasks/:id/status               | GET        | Check the execution status of a specific task    | None                               |

## Partie Docker

Dans le cadre de cette solution, j'ai utilisé Docker pour la gestion des conteneurs, permettant ainsi de déployer l'API ainsi que la base de données de manière isolée et efficace. Voici la configuration Docker utilisée :

```yaml
version: '3.9'

networks:
  rental-network:
    driver: bridge

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: rental-app
    env_file: ./.env
    ports:
      - '3000:3000'
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - db
    networks:
      - rental-network

  db:
    image: postgres:14
    container_name: rentalappdb
    restart: always
    env_file:
      - ./.env
    ports:
      - '5433:5432'
    volumes:
      - ./init-db:/docker-entrypoint-initdb.d
    networks:
      - rental-network
```

### Explication des Services Docker

- **App** : Le service principal de l'application utilise un Dockerfile pour la construction de l'image. Il monte le répertoire local dans le conteneur pour permettre un développement interactif (via volumes). Il expose le port 3000 pour que l'application soit accessible sur ce port de l'hôte. Le conteneur dépend de la base de données, qui est gérée par un autre service.
- **DB** : Utilise l'image officielle de PostgreSQL version 14. Il démarre avec des scripts d'initialisation à partir du répertoire local ./init-db. Expose le port 5432 du conteneur à 5433 de l'hôte pour permettre l'accès à la base de données. Les variables d'environnement sont définies dans un fichier .env pour une configuration sécurisée.

## Suggestions d'Améliorations

1. **Stockage des tâches dans une base de données Redis** : Actuellement, les tâches sont stockées dans une variable en mémoire. Cela peut poser des problèmes de scalabilité et de persistance. Il est recommandé de stocker ces tâches dans une base de données dédiée, telle que Redis.

2. **Mise en place d'un système de log centralisé** : Il serait intéressant de centraliser les logs dans un outil comme ELK Stack (Elasticsearch, Logstash, Kibana) ou Grafana Loki pour mieux suivre les erreurs, analyser les performances et centraliser les informations provenant de différents services.

3. **Automatisation du scaling horizontal avec Kubernetes** : Pour gérer plus de trafic et de plus en plus de données, l'intégration avec Kubernetes permettrait de gérer le déploiement, la mise à l'échelle et la gestion des conteneurs de manière automatique.

