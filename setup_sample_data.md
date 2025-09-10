# 🍽️ Foodie Application - Sample Data Setup Guide

This guide will help you populate your Foodie application with sample data for testing and development.

## 📋 Prerequisites

1. **PostgreSQL Database** - Make sure PostgreSQL is running
2. **Go Backend** - Ensure your Go backend is set up
3. **React Frontend** - Ensure your React frontend is configured
4. **Environment Variables** - Create a `.env` file in the backend directory

## 🚀 Quick Setup

### Step 1: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASS=your_password
DB_NAME=your_database_name
DB_SSLMODE=disable
```

### Step 2: Run Database Seeding

Choose one of the following methods:

#### Option A: PowerShell (Windows)
```powershell
cd backend
.\run_seed.ps1
```

#### Option B: Batch File (Windows)
```cmd
cd backend
run_seed.bat
```

#### Option C: Manual Go Command
```bash
cd backend
go run seed.go
```

### Step 3: Create Placeholder Images

#### Option A: Using HTML Generator
1. Open `backend/create_placeholders.html` in your browser
2. Click "Generate All Placeholder Images"
3. Download each image and place them in `client/public/uploads/`

#### Option B: Using Python Script
```bash
cd backend
python create_placeholders.py
```

#### Option C: Manual Creation
Create the following images in `client/public/uploads/`:
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

## 👥 Sample Users Created

| Username | Name | Specialty | Password |
|----------|------|-----------|----------|
| chef_mario | Mario Rossi | Italian Cuisine | password123 |
| sarah_baker | Sarah Johnson | Desserts & Baking | password123 |
| asian_fusion | Li Wei | Japanese & Asian | password123 |
| vegan_chef | Emma Green | Plant-based Recipes | password123 |
| bbq_master | Jake Thompson | BBQ & Grilling | password123 |
| dessert_queen | Sophie Martinez | French Desserts | password123 |
| spice_lover | Raj Patel | Indian & Spicy Cuisine | password123 |
| healthy_eats | Alex Chen | Healthy Meals | password123 |

## 🍕 Sample Content Created

### Food Posts (10 posts)
- **Italian Carbonara** - Classic Roman pasta
- **Chocolate Chip Cookies** - Soft and chewy
- **Ramen Bowl Deluxe** - Rich tonkotsu broth
- **Quinoa Buddha Bowl** - Nutritious and colorful
- **Smoked Brisket** - 12-hour smoked perfection
- **Tiramisu Layer Cake** - Elegant coffee dessert
- **Butter Chicken Curry** - Rich Indian curry
- **Green Smoothie Bowl** - Refreshing and healthy
- **Margherita Pizza** - Classic Neapolitan style
- **Sushi Roll Masterpiece** - Beautiful dragon roll

### Social Features
- **8 Friendships** - Pre-established user relationships
- **4 Friend Requests** - Pending friend requests
- **18 Likes** - Various likes on posts
- **16 Comments** - Engaging comments on posts
- **3 Conversations** - Private and group chats
- **7 Messages** - Sample conversation messages
- **6 Notifications** - Various notification types

## 🧪 Testing the Application

1. **Start Backend Server**
   ```bash
   cd backend
   go run main.go
   ```

2. **Start Frontend**
   ```bash
   cd client
   npm start
   ```

3. **Login and Explore**
   - Open http://localhost:3000
   - Login with any sample user (password: `password123`)
   - Explore the populated feed, profiles, and social features

## 🔧 Customization

### Adding More Users
Edit `backend/seed.go` and add more users to the `createSampleUsers` function.

### Adding More Posts
Edit `backend/seed.go` and add more posts to the `createSamplePosts` function.

### Modifying Relationships
Edit the `createSampleRelationships`, `createSampleFriendRequests`, and other social functions.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your `.env` file configuration
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Permission Denied**
   - Ensure your database user has proper permissions
   - Check if the database exists

3. **Go Module Issues**
   ```bash
   cd backend
   go mod tidy
   ```

4. **Images Not Loading**
   - Ensure placeholder images are in `client/public/uploads/`
   - Check file names match exactly

### Reset Database
To clear all data and start fresh:
```bash
cd backend
go run seed.go
```
(The script automatically clears existing data before seeding)

## 📁 File Structure

```
backend/
├── seed.go                    # Main seeding script
├── run_seed.ps1              # PowerShell script (Windows)
├── run_seed.bat              # Batch script (Windows)
├── run_seed.sh               # Bash script (Linux/Mac)
├── create_placeholders.py    # Python image generator
├── create_placeholders.html  # HTML image generator
└── SEED_README.md           # Detailed documentation

client/public/uploads/        # Placeholder images go here
```

## 🎯 Next Steps

After setting up sample data:

1. **Test Authentication** - Login with different users
2. **Explore Social Features** - Test likes, comments, friend requests
3. **Test Messaging** - Try the conversation features
4. **Customize Content** - Add your own posts and users
5. **Test Notifications** - Verify notification system works

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify your database configuration
3. Ensure all dependencies are installed
4. Check the console for error messages

Happy cooking! 🍳👨‍🍳👩‍🍳
