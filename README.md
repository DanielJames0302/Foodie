# 🍽️ Foodie - Social Media Platform for Food Enthusiasts

A full-stack social media application built for food lovers to share recipes, discover new dishes, and connect with fellow food enthusiasts. Built with React TypeScript frontend and Go Fiber backend with real-time messaging capabilities.

## ✨ Features

### 🍳 Recipe Sharing
- Share recipes with photos and videos
- Add recipe details including title, description, category, and calorie information
- Upload and manage food images using Cloudinary integration
- Categorize recipes by type (Italian, Asian, Desserts, etc.)
- Real-time post updates and notifications

### 👥 Social Features
- **User Profiles**: Customizable profiles with cover photos and personal information
- **Follow System**: Follow other users to see their content in your feed
- **Friend Requests**: Send and manage friend requests with real-time notifications
- **Real-time Messaging**: Chat with friends using Pusher integration
- **Notifications**: Get notified about likes, comments, friend requests, and messages
- **Search**: Find users and recipes with advanced search functionality

### 💬 Engagement
- **Like Posts**: Show appreciation for recipes with instant feedback
- **Comments**: Discuss recipes and share cooking tips
- **Real-time Updates**: See new posts and interactions instantly
- **Activity Feed**: Personalized feed based on your connections

### 🔍 Discovery
- **Feed**: Browse recipes from followed users
- **Search**: Find users and recipes with filtering options
- **Categories**: Filter recipes by cuisine type and dietary preferences
- **Explore**: Discover trending recipes and popular users

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** with TypeScript 4.9.5
- **React Router DOM 6.23.1** for navigation
- **Redux Toolkit 2.2.5** for state management
- **TanStack React Query 5.36.0** for data fetching
- **Tailwind CSS 3.4.4** for styling
- **Framer Motion 11.2.13** for animations
- **Pusher 5.2.0** for real-time features
- **Axios 1.6.8** for API communication
- **React Hook Form 7.52.0** for form handling
- **React Hot Toast 2.4.1** for notifications
- **Bootstrap 5.3.3** for additional UI components
- **Cloudinary React 1.13.0** for image management

### Backend
- **Go 1.22.3** with Fiber v2.52.4 framework
- **GORM 1.25.10** for database ORM
- **PostgreSQL** for database
- **JWT 3.2.2** for authentication
- **Pusher HTTP Go 5.1.1** for real-time messaging
- **Cloudinary** for image uploads and management
- **Bcrypt** for password hashing

### Database Schema
- **Users**: User profiles and authentication
- **Posts**: Recipe posts with media
- **Comments**: Recipe discussions
- **Likes**: User interactions
- **Relationships**: Follow/friend connections
- **Conversations**: Chat conversations
- **Messages**: Individual chat messages
- **Notifications**: User notifications

## 🚀 Getting Started

### Prerequisites
- **Go 1.22.3** or higher
- **Node.js 16** or higher
- **PostgreSQL** database
- **Pusher account** (for real-time features)
- **Cloudinary account** (for image uploads)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Foodie/backend
   ```

2. **Install Go dependencies**
   ```bash
   go mod download
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=foodie_db
   DB_SSLMODE=disable
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   
   # Pusher Configuration (for real-time messaging)
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_KEY=your_pusher_key
   PUSHER_SECRET=your_pusher_secret
   PUSHER_CLUSTER=your_pusher_cluster
   
   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the backend server**
   ```bash
   go run main.go
   ```
   The server will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to the client directory**
   ```bash
   cd ../client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The application will open on `http://localhost:3000`

### 🎯 Sample Data Setup

To populate the application with sample data for testing:

1. **Run the seeding script**
   ```bash
   cd backend
   # Choose one of the following methods:
   
   # PowerShell (Windows)
   .\run_seed.ps1
   
   # Batch file (Windows)
   run_seed.bat
   
   # Manual Go command
   go run seed.go
   ```

2. **Sample users created** (password: `password123`):
   - `chef_mario` - Mario Rossi (Italian Cuisine)
   - `sarah_baker` - Sarah Johnson (Desserts & Baking)
   - `asian_fusion` - Li Wei (Japanese & Asian)
   - `vegan_chef` - Emma Green (Plant-based Recipes)
   - `bbq_master` - Jake Thompson (BBQ & Grilling)
   - `dessert_queen` - Sophie Martinez (French Desserts)
   - `spice_lover` - Raj Patel (Indian & Spicy Cuisine)
   - `healthy_eats` - Alex Chen (Healthy Meals)

3. **Sample content includes**:
   - 10 food posts with images
   - 8 friendships and 4 friend requests
   - 18 likes and 16 comments
   - 3 conversations with 7 messages
   - 6 notifications

For detailed setup instructions, see [setup_sample_data.md](setup_sample_data.md).

## ⚡ Quick Start

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd Foodie
   ```

2. **Backend setup**
   ```bash
   cd backend
   go mod download
   # Create .env file with your database credentials
   go run main.go
   ```

3. **Frontend setup**
   ```bash
   cd client
   npm install
   npm start
   ```

4. **Add sample data**
   ```bash
   cd backend
   go run seed.go
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Login with any sample user (password: `password123`)

## 📁 Project Structure

```
Foodie/
├── backend/                 # Go Fiber backend
│   ├── controllers/         # API controllers
│   │   ├── auth.go         # Authentication endpoints
│   │   ├── post.go         # Post management
│   │   ├── user.go         # User management
│   │   ├── comments.go     # Comment system
│   │   ├── likes.go        # Like functionality
│   │   ├── relationships.go # Follow/friend system
│   │   ├── conversations.go # Chat conversations
│   │   ├── messages.go     # Chat messages
│   │   ├── notification.go # Notifications
│   │   ├── pusher.go       # Real-time features
│   │   ├── upload.go       # File uploads
│   │   └── request.go      # Request handling
│   ├── models/             # Database models
│   │   └── models.go       # GORM models
│   ├── routes/             # API routes
│   │   └── routes.go       # Route definitions
│   ├── middlewares/        # Custom middlewares
│   │   └── user.go         # User authentication middleware
│   ├── storage/            # Database configuration
│   │   └── postgres.go     # PostgreSQL connection
│   ├── utils/              # Utility functions
│   │   └── auth.go         # Authentication utilities
│   ├── seed.go             # Database seeding script
│   ├── run_seed.*          # Seeding scripts (Windows/Linux)
│   └── main.go             # Application entry point
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── conversation/ # Chat components
│   │   │   ├── follow_requests/ # Friend request components
│   │   │   ├── navbar/     # Navigation components
│   │   │   ├── post/       # Post components
│   │   │   ├── profile/    # Profile components
│   │   │   └── sidebar/    # Sidebar components
│   │   ├── pages/          # Page components
│   │   │   ├── home/       # Home page
│   │   │   ├── login/      # Login page
│   │   │   ├── register/   # Registration page
│   │   │   ├── profile/    # Profile page
│   │   │   ├── messenger/  # Chat page
│   │   │   └── conversation/ # Conversation page
│   │   ├── context/        # React contexts
│   │   │   ├── authContext.tsx # Authentication context
│   │   │   └── darkModeContext.tsx # Dark mode context
│   │   ├── hooks/          # Custom hooks
│   │   │   ├── useConversation.ts # Chat hooks
│   │   │   ├── useActiveList.ts # Active user hooks
│   │   │   └── useDebounce.ts # Search debouncing
│   │   ├── api/            # API functions
│   │   │   ├── userActions.ts # User API calls
│   │   │   ├── profileApi.ts # Profile API calls
│   │   │   └── followAction.ts # Follow API calls
│   │   ├── interfaces/     # TypeScript interfaces
│   │   │   ├── user.ts     # User interfaces
│   │   │   ├── profile.ts  # Profile interfaces
│   │   │   └── chat.ts     # Chat interfaces
│   │   ├── libs/           # External library configs
│   │   │   └── pusher.ts   # Pusher configuration
│   │   ├── utils/          # Utility functions
│   │   └── router/         # Routing configuration
│   │       └── router.tsx  # Route definitions
│   ├── public/             # Static assets
│   │   ├── uploads/        # User uploaded images
│   │   └── images/         # Default images
│   ├── package.json        # Dependencies and scripts
│   ├── tailwind.config.js  # Tailwind configuration
│   └── tsconfig.json       # TypeScript configuration
├── setup_sample_data.md    # Sample data setup guide
└── README.md              # Project documentation
```

## 🔧 Key Features Implementation

### Authentication
- JWT-based authentication
- Session management with Fiber sessions
- Protected routes on frontend

### Real-time Messaging
- Pusher integration for instant messaging
- Conversation management
- Message history and read receipts

### Image Upload
- Cloudinary integration for image storage
- Support for profile pictures and recipe images
- Image optimization and CDN delivery

### Social Features
- Follow/unfollow system
- Friend request management
- Activity feed with real-time updates

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode Support**: Toggle between light and dark themes
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Smooth Animations**: Framer Motion for engaging interactions
- **Toast Notifications**: User feedback for actions

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Protected API endpoints

## 📱 Mobile Responsive

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Backend Deployment
1. **Build the Go application**
   ```bash
   cd backend
   go build -o foodie-backend main.go
   ```

2. **Set up PostgreSQL database**
   - Create production database
   - Run migrations if needed
   - Configure connection string

3. **Configure environment variables**
   - Set all required environment variables
   - Use secure JWT secrets
   - Configure Pusher and Cloudinary credentials

4. **Deploy to your preferred hosting service**
   - AWS, Google Cloud, DigitalOcean, etc.
   - Ensure proper CORS configuration
   - Set up SSL certificates

### Frontend Deployment
1. **Build the React application**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy the build folder**
   - Upload to Netlify, Vercel, or your hosting service
   - Configure environment variables for production API endpoints

3. **Configure API endpoints**
   - Update API base URL for production
   - Ensure CORS is properly configured on backend

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
- **Error**: `dial tcp: connection refused`
  - **Solution**: Ensure PostgreSQL is running and accessible
  - Check database credentials in `.env` file
  - Verify database exists and user has proper permissions

#### Authentication Issues
- **Error**: `JWT token invalid`
  - **Solution**: Check JWT_SECRET in environment variables
  - Ensure token is not expired
  - Verify token format and signing method

#### Real-time Features Not Working
- **Error**: Pusher connection failed
  - **Solution**: Verify Pusher credentials in `.env`
  - Check network connectivity
  - Ensure Pusher app is active

#### Image Upload Issues
- **Error**: Cloudinary upload failed
  - **Solution**: Verify Cloudinary credentials
  - Check image file size and format
  - Ensure proper CORS configuration

#### Frontend Build Issues
- **Error**: Module not found
  - **Solution**: Run `npm install` to install dependencies
  - Clear node_modules and package-lock.json, then reinstall
  - Check for version conflicts

#### Sample Data Issues
- **Error**: Seeding script fails
  - **Solution**: Ensure database is running and accessible
  - Check database permissions
  - Verify `.env` configuration
  - Run `go mod tidy` to fix dependencies

### Development Tips

1. **Hot Reload Issues**
   - Restart both frontend and backend servers
   - Clear browser cache
   - Check for port conflicts

2. **Database Reset**
   ```bash
   cd backend
   go run seed.go  # This clears and reseeds the database
   ```

3. **Dependency Issues**
   ```bash
   # Backend
   cd backend
   go mod tidy
   go mod download
   
   # Frontend
   cd client
   npm install
   ```

4. **Environment Variables**
   - Double-check all required variables are set
   - Use strong, unique secrets for production
   - Never commit `.env` files to version control

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Social Features
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `POST /api/follow/:id` - Follow user
- `POST /api/unfollow/:id` - Unfollow user
- `GET /api/followers/:id` - Get user followers
- `GET /api/following/:id` - Get user following

### Messaging
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create conversation
- `GET /api/messages/:id` - Get conversation messages
- `POST /api/messages` - Send message

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Daniel James** - [GitHub](https://github.com/DanielJames0302)

## 🙏 Acknowledgments

- [Go Fiber](https://gofiber.io/) - Web framework
- [React](https://reactjs.org/) - Frontend library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Pusher](https://pusher.com/) - Real-time messaging
- [Cloudinary](https://cloudinary.com/) - Image management
- [PostgreSQL](https://www.postgresql.org/) - Database

---

**Foodie** - Where food lovers connect, share, and discover amazing recipes! 🍽️✨

*Built with ❤️ for the food community* 