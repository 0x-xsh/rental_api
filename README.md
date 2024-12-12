
- **Prérequis :**
  - Docker doit être installé.

- **Démarrez l'APP** :
     ```bash
     docker compose up
     ```

 
# API Endpoints Summary

| **Entity**    | **Endpoint**                     | **Method** | **Description**                                   | **Body Parameters**               |
|---------------|----------------------------------|------------|---------------------------------------------------|------------------------------------|
| **Customer**  | /customers                      | POST       | Create a new customer                            | `first_name`, `last_name`, `email`, `store_id`, `activebool`, `active`, `timezone` |
| **Customer**  | /customers/:id                  | PUT        | Update an existing customer by ID                | `first_name`, `last_name`, `email`, `store_id`, `activebool`, `active`, `timezone` |
| **Rental**    | /rentals                        | POST       | Create a new rental                              | `customer_id`, `film_id`, `rental_date`, `return_date`, `timezone` |
| **Task**      | /tasks                          | GET        | List all scheduled tasks                         | None                               |
| **Task**      | /tasks/:id/execute              | POST       | Manually trigger a scheduled task by ID          | None                               |
| **Task**      | /tasks/:id/status               | GET        | Check the execution status of a specific task    | None                               

