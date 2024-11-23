# API Documentation - Rentals and Tasks Management

---

## Functionalities / Architecture
- **Initial Investigation**:  
  Discovered a hidden JWT in the HTML structure, decoded it on [jwt.io](https://jwt.io) to retrieve query param, and tested the endpoint to unlock a challenge (https://djob-website-test.nw.r.appspot.com/934b1ee5-4c73-4d3d-93b9-3ccbbf964e9d?fbclid=IwZXh0bgNhZW0CMTAAAR0t_PwUyVJYL7HpaF0tVrXbZ9e7MyuZZCX5PMUUzX0PuD3__zafL_BSjDw_aem_nVdTX9mgHhlNivBDcadHmA).  
- **API Design**:  
  Created a quick UML diagram for API design, adhering to data contracts using DTOs.  
- **Database Modifications**:  
  Used `ALTER TABLE` to add required columns to `customer` and `rental` tables.
  Used `ALTER TABLE` to add required table `task` to store the scheduled tasks.  
    
- **Task Scheduling**:  
  - For each rental, two tasks are created: one 5 days before the return date and another 3 days before.  
  - Dates are stored and processed in UTC.  
  - A cron job checks the database hourly to retrieve and execute "pending" tasks.  
- **Docker Compose Setup**:  
  - Containers for the application (`app`) and the PostgreSQL database (`db`).    
  - Network isolation with `rental-network`.
  - init-db containing a sql script for intializing the db with sakila data
- **Improvement Suggestions**:  
  - **Redis** for task storage instead of in-memory to ensure persistence.  
  - **Kubernetes Integration** for horizontal scaling.  

---

## Entities
1. **Film**
   - Represents the movies available for rental.
   - **Relationships**: One-to-Many with `Rental`.

2. **Rental**
   - Represents customer rentals.
   - **Relationships**: 
     - Many-to-One with `Film`.  
     - Each `Rental` triggers the creation of 2 `Task` entities.  

3. **Task**
   - Represents scheduled tasks related to rentals.
   - **Relationships**: Associated with a specific `Rental`.  

---

## Endpoints
# API Endpoints Summary

| **Entity**    | **Endpoint**                     | **Method** | **Description**                                   | **Body Parameters**               |
|---------------|----------------------------------|------------|---------------------------------------------------|------------------------------------|
| **Customer**  | /customers                      | POST       | Create a new customer                            | `first_name`, `last_name`, `email`, `store_id`, `activebool`, `active`, `timezone` |
| **Customer**  | /customers/:id                  | PUT        | Update an existing customer by ID                | `first_name`, `last_name`, `email`, `store_id`, `activebool`, `active`, `timezone` |
| **Rental**    | /rentals                        | POST       | Create a new rental                              | `customer_id`, `rental_date`, `return_date`, `timezone` |
| **Task**      | /tasks                          | GET        | List all scheduled tasks                         | None                               |
| **Task**      | /tasks/:id/execute              | POST       | Manually trigger a scheduled task by ID          | None                               |
| **Task**      | /tasks/:id/status               | GET        | Check the execution status of a specific task    | None                               |
## Docker Configuration
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
      - rental-network`
