# PowerShell script to run database seeding

Write-Host "Starting database seeding..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found. Please create one with your database configuration." -ForegroundColor Red
    Write-Host "Example .env file:" -ForegroundColor Yellow
    Write-Host "DB_HOST=localhost"
    Write-Host "DB_PORT=5432"
    Write-Host "DB_USER=your_username"
    Write-Host "DB_PASS=your_password"
    Write-Host "DB_NAME=your_database_name"
    Write-Host "DB_SSLMODE=disable"
    exit 1
}

# Run the seed script
Write-Host "Running seed script..." -ForegroundColor Blue
go run seed.go

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database seeding completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Database seeding failed!" -ForegroundColor Red
}
