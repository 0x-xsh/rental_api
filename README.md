![image](https://github.com/user-attachments/assets/9046906c-d9bc-4d46-ab83-6c60fc536df5)


# SETUP
`docker compose up --build`

the environement variables (DATABASE_HOST..etc) can be changed in the `.env` file.

# Overview of the Task scheduling mechanism

- **Task Planning Strategy**:
  - For each rental, I check if the customer and stock exist.
  - I then retrieve the rental date and return date.
  - Both rental and return dates are **converted to UTC** to ensure uniformity in date comparison across different time zones.

- **Why Convert to UTC?**:
  - Ensures that dates from customers in different time zones can be compared correctly.
  - Prevents discrepancies when comparing dates between customers and server instances, as the server may be running in multiple time zones.
  - Guarantees accurate scheduling and task execution based on a single, standardized time reference (UTC).
  
- **Task Creation**:
- 
  - I create **two tasks for each rental**:
    - One task set to 5 days before the return date.
    - Another task set to 3 days before the return date.
  - The task due dates are also stored in **UTC**.
  - 
![Screenshot from 2024-11-23 11-11-07](https://github.com/user-attachments/assets/8ac079b6-e053-4b30-8f64-a35cd1331603)

- **Cron Job Setup**:
  - I set up 2 **cron jobs** that runs every hour to retrieve tasks from the db just in case i miss some, and another that runs every minute to check fi a task is wthin 5 minutes of execution time.
  - I chose a one-hour interval to avoid database overload while ensuring no tasks are missed.
  
- **Task Execution Timing**:
  - If a rental is added right after a cron job check, the closest task will still be executed, as the nearest task is at least two days after creation.
  - This ensures no tasks are missed even if they are created immediately after a scheduled cron check.

# API Documentation - Rentals and Tasks Management

---

## Functionalities / Architecture
- **Initial Investigation**:  
  Discovered a hidden JWT in the HTML structure, decoded it on [jwt.io](https://jwt.io) to retrieve query param, and tested the endpoint to unlock a challenge (https://djob-website-test.nw.r.appspot.com/934b1ee5-4c73-4d3d-93b9-3ccbbf964e9d?fbclid=IwZXh0bgNhZW0CMTAAAR0t_PwUyVJYL7HpaF0tVrXbZ9e7MyuZZCX5PMUUzX0PuD3__zafL_BSjDw_aem_nVdTX9mgHhlNivBDcadHmA).  
- **API Design**:  
  Created a quick UML diagram for API design, adhering to data contracts using DTOs.  
- **Database Modifications**:  
  - Used `ALTER TABLE` to add required columns to `customer` and `rental` tables.
  - Used `ALTER TABLE` to add required table `task` to store the scheduled tasks.  
    
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
      - '5433:5432' //5433 instead of 5432 to avoid default port scanning malware 
    volumes:
      - ./init-db:/docker-entrypoint-initdb.d
    networks:
      - rental-network`
