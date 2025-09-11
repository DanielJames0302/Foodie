# Database Seeding for Foodie Application

This directory contains scripts to populate your Foodie application database with sample data for testing and development purposes.

## Prerequisites

1. **PostgreSQL Database**: Make sure you have PostgreSQL running and accessible
2. **Environment Variables**: Create a `.env` file in the backend directory with your database configuration
3. **Go Dependencies**: Ensure all Go modules are installed (`go mod tidy`)

## Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASS=your_password
DB_NAME=your_database_name
DB_SSLMODE=disable
```

## Sample Data Included

The seeding script will create:

### Users (8 sample users)
- **chef_mario** - Italian cuisine specialist
- **sarah_baker** - Dessert and baking expert
- **asian_fusion** - Japanese and Asian cuisine
- **vegan_chef** - Plant-based recipes
- **bbq_master** - BBQ and grilling specialist
- **dessert_queen** - French desserts and pastries
- **spice_lover** - Indian and spicy cuisine
- **healthy_eats** - Healthy and nutritious meals

**Default Password**: `password123` (for all users)

### Posts (10 sample food posts)
- Authentic Italian Carbonara
- Chocolate Chip Cookies
- Ramen Bowl Deluxe
- Quinoa Buddha Bowl
- Smoked Brisket
- Tiramisu Layer Cake
- Butter Chicken Curry
- Green Smoothie Bowl
- Margherita Pizza
- Sushi Roll Masterpiece

### Social Features
- **Friendships**: Pre-established relationships between users
- **Friend Requests**: Pending friend requests
- **Likes**: Sample likes on various posts
- **Comments**: Engaging comments on posts
- **Conversations**: Private and group chats
- **Messages**: Sample conversation messages
- **Notifications**: Various types of notifications

## Running the Seeding Script

### Windows (PowerShell)
```powershell
cd backend
.\run_seed.ps1
```

### Linux/Mac (Bash)
```bash
cd backend
chmod +x run_seed.sh
./run_seed.sh
```

### Manual Execution
```bash
cd backend
go run seed.go
```

## What the Script Does

1. **Clears existing data** - Removes all existing data from the database
2. **Creates users** - Adds 8 sample users with hashed passwords
3. **Creates posts** - Adds 10 sample food posts with different categories
4. **Establishes relationships** - Creates friendships between users
5. **Adds social interactions** - Creates likes, comments, and friend requests
6. **Sets up conversations** - Creates private and group chats with sample messages
7. **Generates notifications** - Creates various types of notifications

## Sample Images

The posts reference image files that should be placed in `client/public/uploads/`. You can use any food images or create placeholder images with the following names:

- `carbonara.jpg`
- `cookies.jpg`
- `ramen.jpg`
- `buddha-bowl.jpg`
- `brisket.jpg`
- `tiramisu.jpg`
- `butter-chicken.jpg`
- `smoothie-bowl.jpg`
- `pizza.jpg`
- `sushi.jpg`

## Testing the Application

After running the seeding script:

1. Start your backend server: `go run main.go`
2. Start your frontend: `cd client && npm start`
3. Login with any of the sample users using password `password123`
4. Explore the populated feed, user profiles, and social features

## Troubleshooting

- **Database connection issues**: Check your `.env` file configuration
- **Permission errors**: Ensure your database user has CREATE, INSERT, UPDATE, DELETE permissions
- **Go module issues**: Run `go mod tidy` to ensure all dependencies are installed
- **Image not found**: Make sure sample images are placed in the correct directory

## Customization

You can modify the `seed.go` file to:
- Add more users with different profiles
- Create additional posts with different categories
- Adjust the social relationships and interactions
- Add more realistic conversation data
- Customize notification types and content

## Security Note

⚠️ **Important**: The sample data includes plain text passwords that are hashed before storage. In production, always use strong, unique passwords and proper password policies.

