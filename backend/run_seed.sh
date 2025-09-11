#!/bin/bash

# Run the database seeding script
echo "Starting database seeding..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create one with your database configuration."
    echo "Example .env file:"
    echo "DB_HOST=localhost"
    echo "DB_PORT=5432"
    echo "DB_USER=your_username"
    echo "DB_PASS=your_password"
    echo "DB_NAME=your_database_name"
    echo "DB_SSLMODE=disable"
    exit 1
fi

# Run the seed script
go run seed.go

echo "Database seeding completed!"

