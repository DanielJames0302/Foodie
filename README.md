# 🍽️ Foodie - Social Media Platform for Food Enthusiasts

A full-stack social media application built for food lovers to share recipes, discover new dishes, and connect with fellow food enthusiasts. Built with React TypeScript frontend and Go Fiber backend.

## ✨ Features

### 🍳 Recipe Sharing
- Share recipes with photos and videos
- Add recipe details including title, description, category, and calorie information
- Upload and manage food images
- Categorize recipes by type

### 👥 Social Features
- **User Profiles**: Customizable profiles with cover photos and personal information
- **Follow System**: Follow other users to see their content
- **Friend Requests**: Send and manage friend requests
- **Real-time Messaging**: Chat with friends using Pusher integration
- **Notifications**: Get notified about likes, comments, and friend requests

### 💬 Engagement
- **Like Posts**: Show appreciation for recipes
- **Comments**: Discuss recipes and share tips
- **Real-time Updates**: See new posts and interactions instantly

### 🔍 Discovery
- **Feed**: Browse recipes from followed users
- **Search**: Find users and recipes
- **Categories**: Filter recipes by type

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Redux Toolkit** for state management
- **React Query** for data fetching
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Pusher** for real-time features
- **Axios** for API communication

### Backend
- **Go 1.22** with Fiber framework
- **GORM** for database ORM
- **PostgreSQL** for database
- **JWT** for authentication
- **Pusher** for real-time messaging
- **Cloudinary** for image uploads

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
- Go 1.22 or higher
- Node.js 16 or higher
- PostgreSQL database
- Pusher account (for real-time features)

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
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=foodie_db
   DB_SSLMODE=disable
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

## 📁 Project Structure

```
Foodie/
├── backend/                 # Go Fiber backend
│   ├── controllers/         # API controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middlewares/        # Custom middlewares
│   ├── storage/            # Database configuration
│   └── utils/              # Utility functions
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── api/            # API functions
│   │   └── interfaces/     # TypeScript interfaces
│   └── public/             # Static assets
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
1. Build the Go application
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy to your preferred hosting service

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy the build folder to your hosting service
3. Configure API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Daniel James** - [GitHub](https://github.com/DanielJames0302)

---

**Foodie** - Where food lovers connect, share, and discover amazing recipes! 🍽️✨ 