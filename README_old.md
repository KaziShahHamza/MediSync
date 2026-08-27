# MediSync - Medicine & Health Tracking App

A full-stack web application for managing medications, tracking health logs, and setting up medicine reminders. Built with React and Node.js.

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Chart.js & Re
## Features

- **User Authentication** - Secure signup/login system with JWT
- **Medicine Management** - Add, edit, and delete medications
- **Medicine Reminders** - Automated reminder scheduling with node-cron
- **Health Tracking** - Log and visualize health metrics with charts
- **Dashboard** - Comprehensive overview of medicines and health data
- **Modern UI** - Responsive design with Tailwind CSS

## Tech Stack

### Frontendact-ChartJS-2** - Data visualization
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Task scheduling for reminders
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (running locally on port 27017)
- **npm** or **yarn** package manager

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd medicine_2
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

## Configuration

### Database Setup

The application connects to MongoDB at `mongodb://localhost:27017/medisync2`. Make sure MongoDB is running locally, or update the connection string in `server/server.js`:

```javascript
mongoose.connect("mongodb://localhost:27017/medisync2")
```

### Environment Variables (Optional)

You can create a `.env` file in the server directory for configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medisync2
JWT_SECRET=your_jwt_secret_key
```

## Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### Start the Frontend Development Server

In a new terminal:

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173` (default Vite port)

## Project Structure

```
medicine_2/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   │   ├── HealthCharts.jsx
│   │   │   ├── HealthLogForm.jsx
│   │   │   ├── MedicineForm.jsx
│   │   │   ├── MedicineList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/       # Context API providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── MedicineContext.jsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useHealthLogs.js
│   │   │   └── useMedicineReminder.js
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Health.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Backend Node.js application
    ├── middleware/        # Express middleware
    │   └── auth.js
    ├── models/            # Mongoose models
    │   ├── HealthLog.js
    │   ├── Medicine.js
    │   └── User.js
    ├── routes/            # API routes
    │   ├── auth.routes.js
    │   ├── health.routes.js
    │   └── medicine.routes.js
    ├── services/          # Business logic
    │   └── reminderScheduler.js
    ├── package.json
    └── server.js          # Server entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Medicines
- `GET /api/medicines` - Get all medicines (protected)
- `POST /api/medicines` - Add new medicine (protected)
- `PUT /api/medicines/:id` - Update medicine (protected)
- `DELETE /api/medicines/:id` - Delete medicine (protected)

### Health Logs
- `GET /api/health` - Get health logs (protected)
- `POST /api/health` - Create health log (protected)

## Features in Detail

### Medicine Management
- Add medications with name, dosage, frequency, and timing
- Edit existing medication details
- Delete medications
- View all medications in an organized list

### Health Tracking
- Log health metrics (e.g., blood pressure, glucose, weight)
- Visualize health data with interactive charts
- Track trends over time

### Reminders
- Automated medicine reminder scheduling
- Customizable reminder times
- Cron-based scheduling for reliability

### Authentication
- Secure password hashing with bcryptjs
- JWT-based authentication
- Protected routes on both client and server

## Building for Production

### Build the Client

```bash
cd client
npm run build
```

The production-ready files will be in `client/dist/`

### Deploy

You can deploy the built frontend to services like:
- Vercel
- Netlify
- GitHub Pages

For the backend, consider:
- Heroku
- Railway
- DigitalOcean
- AWS

## Development

### Linting

```bash
cd client
npm run lint
```

### Preview Production Build

```bash
cd client
npm run preview
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue in the GitHub repository.

---

**Happy Health Tracking!**
