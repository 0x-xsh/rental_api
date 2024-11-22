sudo chmod 777 -R postgres-data
docker compose up --build
chmod 644 init-db/*.sql

