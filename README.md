# Expense Tracker(BudgetBuddy)

A full-stack web application for tracking personal expenses with interactive data visualization, built with React.js, Node.js, Express.js, and MongoDB.

## 🎯 Features

### Core Functionality
- **Expense Management**: Add, edit, and delete expense records
- **Data Visualization**: Interactive pie charts and bar charts showing spending patterns
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Dynamic charts that update with new data

### Advanced Features
- **JWT Authentication**: Secure user registration and login
- **Data Filtering**: Filter expenses by date range, category, and search terms
- **CSV Export**: Export expense data for external analysis
- **Dark Mode**: Toggle between light and dark themes
- **Budget Alerts**: Set monthly budget goals with spending alerts
- **Pagination**: Efficient handling of large expense datasets

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** and **cors** for security

### Frontend
- **React.js** with hooks and context API
- **React Router** for navigation
- **Chart.js** with react-chartjs-2 for data visualization
- **Tailwind CSS** for styling
- **Axios** for API communication
- **date-fns** for date manipulation
- **react-hot-toast** for notifications

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd expense-tracker-assignment
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB installation
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

### 5. Run the Application
```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Expense Endpoints
- `GET /api/expenses` - Get all expenses (with filtering and pagination)
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats` - Get expense statistics

### User Endpoints
- `PUT /api/users/profile` - Update user profile

### Request/Response Examples

#### Add Expense
```javascript
POST /api/expenses
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "amount": 25.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15"
}
```

#### Get Expenses with Filters
```javascript
GET /api/expenses?category=Food&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10
Authorization: Bearer <jwt-token>
```

## 🏗️ Project Architecture

### Folder Structure
```
expense-tracker-assignment/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Charts/     # Chart components
│   │   │   ├── Expenses/   # Expense-related components
│   │   │   ├── Layout/     # Layout components
│   │   │   └── UI/         # Generic UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── main.jsx        # App entry point
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── middleware/         # Custom middleware
│   └── index.js            # Server entry point
├── package.json            # Root package.json
└── README.md
```

### Component Architecture
- **Pages**: Top-level route components (Dashboard, Expenses, Profile)
- **Components**: Reusable UI components organized by feature
- **Contexts**: Global state management (Auth, Theme)
- **Hooks**: Custom React hooks for data fetching and state management

### API Flow
1. Client sends authenticated requests with JWT tokens
2. Express middleware validates tokens and extracts user info
3. Route handlers process requests and interact with MongoDB
4. Responses sent back with appropriate status codes and data

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Primary blue theme with semantic colors
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable button, input, and card components

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts and navigation

### Accessibility
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- High contrast color ratios

## 📊 Data Visualization

### Chart Types
- **Pie Chart**: Category-wise expense distribution
- **Bar Chart**: Monthly expense trends
- **Interactive Features**: Hover tooltips, legends, responsive sizing

### Chart Configuration
```javascript
// Example pie chart data structure
{
  labels: ['Food', 'Transportation', 'Entertainment'],
  datasets: [{
    data: [300, 150, 100],
    backgroundColor: ['#3B82F6', '#EF4444', '#10B981']
  }]
}
```

## 🔒 Security Features

### Authentication
- JWT tokens with 7-day expiration
- Password hashing with bcrypt (12 salt rounds)
- Protected routes requiring authentication

### Input Validation
- Server-side validation using express-validator
- Client-side form validation
- SQL injection prevention through Mongoose

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Add, edit, delete expenses
- [ ] Data filtering and search
- [ ] Chart rendering and updates
- [ ] Responsive design on different devices
- [ ] Dark mode toggle
- [ ] CSV export functionality
- [ ] Budget alerts

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-domain.com
```

### Deployment Platforms
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Heroku, Railway, or DigitalOcean
- **Database**: MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support, please contact:
- Email: yogiyadav1970@example.com

## 🎉 Acknowledgments

- Chart.js for excellent charting library
- Tailwind CSS for utility-first CSS framework
- MongoDB for flexible document database
- React community for amazing ecosystem
