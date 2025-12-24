# EaseHub - College Student Services Platform

EaseHub is a comprehensive full-stack web application designed to help college students manage essential services like PG/Hostel accommodation, meal plans, laundry services, and more from a single unified platform.

## 🚀 Features

### For Students
- **PG/Hostel Finder**: Browse and apply for accommodation near your college
- **Meal Plans**: Subscribe to daily, weekly, or monthly meal plans (veg/non-veg)
- **Laundry Services**: Schedule pickup and delivery for laundry
- **Extra Services**: Request custom services tailored to your needs
- **Dashboard**: Track all your service requests in real-time
- **Profile Management**: Update your personal information and preferences

### For Administrators
- **Analytics Dashboard**: View comprehensive statistics and insights
- **User Management**: Manage registered users
- **Service Management**: Add, edit, or remove services
- **Request Management**: Approve, reject, or update service requests
- **Data Export**: Export data for reporting and analysis

## 🛠️ Technology Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Axios** for API calls
- **Context API** for state management
- Dark/Light mode support

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- RESTful API architecture

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the repository
```bash
cd startup
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (use `.env.example` as template):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/easehub
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@easehub.com
ADMIN_PASSWORD=Admin@123
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start MongoDB
Make sure MongoDB is running on your system.

### Seed the Database (First Time Only)
```bash
cd backend
npm run seed
```

This will create:
- Admin user (admin@easehub.com / Admin@123)
- Sample PG/Hostel listings
- Sample meal plans
- Sample laundry services

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
easehub/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Configuration files
│   │   └── server.js        # Express server
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── layouts/         # Layout components
│   │   ├── context/         # React contexts
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/
│   └── package.json
└── README.md
```

## 🔐 Default Credentials

**Admin Account:**
- Email: admin@easehub.com
- Password: Admin@123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password/:token` - Reset password

### PG/Hostel
- `GET /api/pg` - Get all PG/Hostels
- `GET /api/pg/:id` - Get single PG/Hostel
- `POST /api/pg` - Create PG/Hostel (Admin)
- `PUT /api/pg/:id` - Update PG/Hostel (Admin)
- `DELETE /api/pg/:id` - Delete PG/Hostel (Admin)

### Meal Plans
- `GET /api/meals` - Get all meal plans
- `GET /api/meals/:id` - Get single meal plan
- `POST /api/meals` - Create meal plan (Admin)
- `PUT /api/meals/:id` - Update meal plan (Admin)
- `DELETE /api/meals/:id` - Delete meal plan (Admin)

### Laundry Services
- `GET /api/laundry` - Get all laundry services
- `GET /api/laundry/:id` - Get single laundry service
- `POST /api/laundry` - Create laundry service (Admin)
- `PUT /api/laundry/:id` - Update laundry service (Admin)
- `DELETE /api/laundry/:id` - Delete laundry service (Admin)

### Service Requests
- `POST /api/requests` - Create service request (Protected)
- `GET /api/requests` - Get user's requests (Protected)
- `GET /api/requests/:id` - Get single request (Protected)
- `PUT /api/requests/:id/status` - Update request status (Admin)

### Admin
- `GET /api/admin/analytics` - Get analytics data (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/:id` - Update user (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)
- `GET /api/admin/export` - Export data (Admin)

## 🎨 Features Highlights

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark Mode**: Toggle between light and dark themes
- **Real-time Updates**: Track service request status in real-time
- **Secure Authentication**: JWT-based authentication with password hashing
- **Role-based Access**: Separate interfaces for users and administrators
- **Modern UI**: Clean, professional design with smooth animations

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation
- CORS configuration
- Environment variable protection

## 📱 Mobile Responsiveness

- Mobile-first design approach
- Touch-friendly interface
- Optimized for all screen sizes
- Progressive Web App ready

## 🤝 Contributing

This is a production-ready application. For any improvements or bug fixes, please follow standard Git workflow.

## 📄 License

MIT License

## 👥 Support

For support, email support@easehub.com or create an issue in the repository.

---

**Built with ❤️ for college students**
