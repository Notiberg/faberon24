# Faberon - Car Wash Service Platform

A modern web application for managing car wash services with user profiles, car management, and service booking.

## 🚀 Features

- **User Management**: Create and manage user profiles
- **Car Management**: Add, edit, delete, and select vehicles
- **Service Booking**: Browse and book car wash services
- **Real-time Synchronization**: Frontend and backend fully synchronized
- **Responsive Design**: Beautiful UI with modern styling

## 📋 Tech Stack

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript (ES6+)** - Interactivity
- **Fetch API** - Backend communication

### Backend
- **Go 1.24+** - Server language
- **PostgreSQL 16** - Database
- **Gorilla Mux** - HTTP router
- **Docker** - Containerization

## 🏗️ Project Structure

```
faberon24/
├── index.html              # Main page
├── profile.html            # User profile page
├── css/
│   ├── index.css          # Main page styles
│   ├── profile.css        # Profile page styles
│   └── font.css           # Font definitions
├── js/
│   ├── api.js             # Backend API service
│   ├── index.js           # Main page logic
│   ├── profile.js         # Profile page logic
│   └── animation.js       # Animation utilities
├── image/                 # Images and icons
├── SMC-UserService-main/  # Backend service
└── Documentation files
```

## 🔧 Setup & Installation

### Prerequisites
- Python 3.6+ (for frontend server)
- Docker & Docker Compose (for backend)
- Git

### Frontend Setup

1. Navigate to project directory:
```bash
cd /Users/yaroslav/Desktop/Faberon
```

2. Start frontend server:
```bash
python3 -m http.server 8000
```

3. Open in browser:
```
http://localhost:8000/index.html
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd SMC-UserService-main
```

2. Start all services:
```bash
make docker-up
```

3. Backend will be available at:
```
http://localhost:8080
```

## 📚 API Documentation

### Base URL
```
http://localhost:8080
```

### Authentication
Protected endpoints require headers:
```
X-User-ID: <telegram_user_id>
X-User-Role: <client|manager|superuser>
```

### Key Endpoints

**User Management**
- `POST /users` - Create user
- `GET /users/me` - Get current user
- `PUT /users/me` - Update profile
- `DELETE /users/me` - Delete profile

**Car Management**
- `POST /users/me/cars` - Add car
- `PATCH /users/me/cars/{id}` - Update car
- `DELETE /users/me/cars/{id}` - Delete car
- `PUT /users/me/cars/{id}/select` - Select car

See `API_REFERENCE.md` for complete documentation.

## 🧪 Testing

### Test Credentials
- User ID: `123456789`
- Role: `client`

These are automatically used when no user is logged in.

### Test User Creation
```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "tg_user_id": 123456789,
    "name": "Test User",
    "phone_number": "+79991234567",
    "tg_link": "@testuser",
    "role": "client"
  }'
```

## 📖 Documentation

- `API_REFERENCE.md` - Complete API documentation
- `BACKEND_INTEGRATION.md` - Backend integration guide
- `INTEGRATION_EXAMPLES.md` - Code examples
- `TESTING_REPORT.md` - Testing results
- `BACKEND_SETUP.md` - Backend setup guide

## 🔄 Data Flow

```
User Input → Frontend → API Service → Backend → Database
                                          ↓
                                    PostgreSQL
                                          ↓
                                    Backend → API Response
                                          ↓
                                    Frontend → Display
```

## ✨ Key Features

### Frontend
- ✅ Responsive design
- ✅ Real-time data synchronization
- ✅ Modal windows for user interactions
- ✅ Dropdown menus for car selection
- ✅ Form validation
- ✅ Error handling

### Backend
- ✅ RESTful API
- ✅ PostgreSQL database
- ✅ Role-based access control
- ✅ CORS support
- ✅ Prometheus metrics
- ✅ Graceful shutdown

## 🚀 Deployment

### Docker Deployment
```bash
cd SMC-UserService-main
make docker-up
```

### Local Development
```bash
# Frontend
cd /path/to/faberon24
python3 -m http.server 8000

# Backend
cd SMC-UserService-main
make dev
make run
```

## 📊 Monitoring

### Prometheus
```
http://localhost:9091
```

### Grafana
```
http://localhost:3001
Username: admin
Password: admin
```

## 🐛 Troubleshooting

### Frontend not loading
- Check if Python server is running: `python3 -m http.server 8000`
- Verify port 8000 is not in use
- Check browser console for errors

### Backend not responding
- Verify Docker is running: `docker ps`
- Check backend logs: `make docker-logs-app`
- Restart services: `make docker-restart`

### CORS errors
- Ensure backend is running on `http://localhost:8080`
- Check CORS headers in backend response
- Verify frontend is calling correct API URL

## 📝 License

This project is proprietary and confidential.

## 👥 Team

- **Frontend Developer**: Yaroslav
- **Backend Developer**: SMC Team
- **Project Manager**: Faberon

## 📞 Support

For issues and questions, please contact the development team.

## 🔐 Security

- User authentication via X-User-ID and X-User-Role headers
- Role-based access control (RBAC)
- Input validation on both frontend and backend
- CORS protection
- Database encryption

## 🎯 Future Enhancements

- [ ] JWT authentication
- [ ] User registration flow
- [ ] Payment integration
- [ ] Service ratings and reviews
- [ ] Booking history
- [ ] Push notifications
- [ ] Mobile app

## 📅 Changelog

### Version 1.0.0 (2025-12-06)
- Initial release
- Frontend and backend integration complete
- All core features implemented
- Full API documentation
- Comprehensive testing

---

**Status**: ✅ Production Ready

**Last Updated**: December 6, 2025
