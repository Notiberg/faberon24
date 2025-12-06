# Faberon - Car Wash Service Platform

A modern web application for managing car wash services with user profiles, car management, and service booking.

## 🚀 Quick Start

### Prerequisites
- Python 3.6+ (for frontend server)
- Docker & Docker Compose (for backend)
- Git

### Frontend Setup
```bash
cd /Users/yaroslav/Desktop/Faberon
python3 -m http.server 8000
# Open http://localhost:8000/index.html
```

### Backend Setup
```bash
cd SMC-UserService-main
make docker-up
# Backend available at http://localhost:8080
```

## 📁 Project Structure

```
faberon24/
├── index.html              # Main page
├── profile.html            # User profile page
├── css/                    # Stylesheets
├── js/                     # JavaScript files
│   ├── api.js             # Backend API service
│   ├── index.js           # Main page logic
│   ├── profile.js         # Profile page logic
│   ├── error-handler.js   # Error handling & logging
│   └── animation.js       # Animations
├── image/                 # Images and icons
├── docs/                  # Documentation
│   ├── README.md
│   ├── API_REFERENCE.md
│   ├── BACKEND_INTEGRATION.md
│   ├── ERROR_HANDLING.md
│   └── ... (more docs)
├── SMC-UserService-main/  # Backend service
└── .git/                  # Git repository
```

## 📚 Documentation

All documentation is in the `docs/` folder:

- **[README.md](docs/README.md)** - Project overview
- **[API_REFERENCE.md](docs/API_REFERENCE.md)** - Complete API documentation
- **[BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md)** - Backend setup guide
- **[ERROR_HANDLING.md](docs/ERROR_HANDLING.md)** - Error handling & logging
- **[INTEGRATION_EXAMPLES.md](docs/INTEGRATION_EXAMPLES.md)** - Code examples
- **[TESTING_REPORT.md](docs/TESTING_REPORT.md)** - Test results
- **[BACKEND_SETUP.md](docs/BACKEND_SETUP.md)** - Backend quick start

## ✨ Features

### Frontend
- ✅ Responsive design
- ✅ Real-time data synchronization
- ✅ Error handling & logging
- ✅ Modal windows
- ✅ Car management
- ✅ User profiles

### Backend
- ✅ RESTful API
- ✅ PostgreSQL database
- ✅ CORS support
- ✅ Role-based access control
- ✅ Prometheus metrics
- ✅ Docker deployment

## 🔧 Tech Stack

**Frontend**: HTML5, CSS3, JavaScript (ES6+)
**Backend**: Go 1.24+, PostgreSQL 16, Docker
**API**: RESTful with JSON

## 🧪 Testing

Test credentials (auto-loaded):
- User ID: `123456789`
- Role: `client`

## 📊 API Endpoints

### User Management
- `POST /users` - Create user
- `GET /users/me` - Get current user
- `PUT /users/me` - Update profile
- `DELETE /users/me` - Delete profile

### Car Management
- `POST /users/me/cars` - Add car
- `PATCH /users/me/cars/{id}` - Update car
- `DELETE /users/me/cars/{id}` - Delete car
- `PUT /users/me/cars/{id}/select` - Select car

See [API_REFERENCE.md](docs/API_REFERENCE.md) for complete documentation.

## 🐛 Error Handling

The frontend includes comprehensive error handling:
- Global error handlers
- User-friendly error messages
- Logging system with localStorage
- Automatic error recovery

See [ERROR_HANDLING.md](docs/ERROR_HANDLING.md) for details.

## 🚀 Deployment

### Docker
```bash
cd SMC-UserService-main
make docker-up
```

### Local Development
```bash
# Frontend
python3 -m http.server 8000

# Backend
cd SMC-UserService-main
make dev
make run
```

## 📞 Support

For issues and questions:
1. Check documentation in `docs/` folder
2. Review browser console logs
3. Check backend logs: `make docker-logs-app`

## 📝 License

Proprietary and confidential.

## 🎯 Status

✅ **Production Ready**

- All features implemented
- Full API integration
- Comprehensive error handling
- Complete documentation

---

**Last Updated**: December 6, 2025
**Repository**: https://github.com/Notiberg/faberon24.git
