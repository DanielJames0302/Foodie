@echo off
echo Starting database seeding...

REM Check if .env file exists
if not exist ".env" (
    echo Error: .env file not found. Please create one with your database configuration.
    echo Example .env file:
    echo DB_HOST=localhost
    echo DB_PORT=5432
    echo DB_USER=your_username
    echo DB_PASS=your_password
    echo DB_NAME=your_database_name
    echo DB_SSLMODE=disable
    pause
    exit /b 1
)

REM Run the seed script
echo Running seed script...
go run seed.go

if %ERRORLEVEL% EQU 0 (
    echo Database seeding completed successfully!
) else (
    echo Database seeding failed!
)

pause

