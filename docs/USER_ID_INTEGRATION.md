# X-UserID Integration Guide

## Overview

The Faberon application supports automatic user identification through URL query parameters. This allows seamless integration with Telegram bots and other external systems that need to pass user IDs to the application.

## How It Works

### 1. URL Parameter Parsing

When a user visits the application with a URL like:
```
https://auto-theme-chro.vercel.app?X-UserID=1122333
```

The application automatically:
1. Extracts the `X-UserID` parameter from the URL
2. Validates and stores it
3. Uses it for all subsequent API calls
4. Persists it in localStorage for future sessions

### 2. Priority Order

The application loads user ID in this priority order:

1. **URL Parameter** (`X-UserID` query parameter) - Highest priority
2. **localStorage** (from previous sessions)
3. **Test Credentials** (123456789) - Fallback

### 3. Code Implementation

#### Frontend (js/api.js)

```javascript
// Parse X-UserID from URL query parameters
function parseUserIDFromURL() {
  const params = new URLSearchParams(window.location.search);
  const userIDFromURL = params.get('X-UserID');
  
  if (userIDFromURL) {
    logger.info('User ID from URL', { userIDFromURL });
    return userIDFromURL;
  }
  
  return null;
}

// Load credentials from URL or storage
function loadUserCredentials() {
  // First, try to get userID from URL parameters
  const userIDFromURL = parseUserIDFromURL();
  
  if (userIDFromURL) {
    // If found in URL, use it and save to localStorage
    setUserCredentials(userIDFromURL, 'client');
    logger.info('User credentials loaded from URL', { userID: userIDFromURL });
  } else {
    // Otherwise, load from localStorage
    currentUserID = localStorage.getItem('userID');
    currentUserRole = localStorage.getItem('userRole') || 'client';
    logger.info('User credentials loaded from localStorage', { userID: currentUserID });
  }
}
```

## Usage Examples

### 1. Telegram Bot Integration

When a user clicks a button in a Telegram bot, send them to:

```
https://auto-theme-chro.vercel.app?X-UserID=<telegram_user_id>
```

Example:
```
https://auto-theme-chro.vercel.app?X-UserID=123456789
```

### 2. Direct Links

Create shareable links with user IDs:

```
http://localhost:8000/index.html?X-UserID=1122333
http://localhost:8000/profile.html?X-UserID=9876543210
```

### 3. Multiple Parameters

You can combine with other parameters:

```
https://auto-theme-chro.vercel.app?X-UserID=123456789&ref=telegram&lang=ru
```

(Currently only X-UserID is parsed, but the structure supports future expansion)

## System Flow

```
User clicks Telegram link
         ↓
URL: https://app.com?X-UserID=123456789
         ↓
Frontend loads (DOMContentLoaded)
         ↓
loadUserCredentials() called
         ↓
parseUserIDFromURL() extracts X-UserID
         ↓
setUserCredentials(123456789, 'client')
         ↓
Save to localStorage
         ↓
API calls use X-User-ID header
         ↓
Backend returns user-specific data
         ↓
UI displays user's cars, services, etc.
```

## Data Flow Through System

### 1. Frontend (js/api.js)
- Parses URL parameter
- Stores in `currentUserID` variable
- Saves to localStorage
- Includes in API headers as `X-User-ID`

### 2. Backend (UserService)
- Receives `X-User-ID` header
- Validates user exists
- Returns user-specific data
- Ensures data isolation

### 3. API Calls

All API calls automatically include the user ID:

```javascript
// Example API call
const response = await fetch('http://localhost:8080/users/me', {
  method: 'GET',
  headers: {
    'X-User-ID': '123456789',  // Automatically added
    'X-User-Role': 'client'
  }
});
```

## User Data Isolation

Each user sees only their own data:

- **Cars**: Only user's cars are displayed
- **Services**: Personalized service recommendations
- **History**: User-specific service history
- **Profile**: User's personal information

## Logging

The application logs all user ID operations:

```javascript
// In browser console (F12)
[INFO] User ID from URL { userIDFromURL: "123456789" }
[INFO] User credentials loaded from URL { userID: "123456789" }
[INFO] User data loaded successfully { name: "John", carsCount: 3 }
```

## Testing

### Test with Different User IDs

1. **User 1**: `http://localhost:8000/index.html?X-UserID=123456789`
2. **User 2**: `http://localhost:8000/index.html?X-UserID=987654321`
3. **User 3**: `http://localhost:8000/index.html?X-UserID=1122333`

Each user will see their own cars and data.

### Verify in DevTools

1. Open browser DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Check `userID` value
4. Go to **Network** tab
5. Check request headers for `X-User-ID`

## Security Considerations

⚠️ **Important**: The X-UserID is passed in the URL and localStorage, which are not secure for sensitive data. For production:

1. Use HTTPS only
2. Implement proper authentication (OAuth, JWT)
3. Validate user ID on backend
4. Use secure session management
5. Implement rate limiting

## Troubleshooting

### User ID Not Loading

**Problem**: User ID shows as null or undefined

**Solutions**:
1. Check URL parameter spelling: `X-UserID` (case-sensitive)
2. Verify URL format: `?X-UserID=123456789`
3. Clear localStorage: DevTools → Application → Clear All
4. Reload page: Cmd+Shift+R (hard refresh)

### Wrong User Data Displayed

**Problem**: Seeing another user's data

**Solutions**:
1. Clear localStorage
2. Use hard refresh (Cmd+Shift+R)
3. Check browser console for errors
4. Verify backend is running

### API Errors (400, 401)

**Problem**: API returns error

**Solutions**:
1. Check user ID is numeric
2. Verify user exists in database
3. Check backend logs
4. Restart backend service

## Future Enhancements

Potential improvements:

1. **Additional Parameters**: Support more query parameters
2. **JWT Tokens**: Replace simple user ID with JWT
3. **Session Management**: Implement proper session handling
4. **Multi-Device**: Sync user data across devices
5. **Notifications**: Send notifications to user's Telegram

## API Reference

### Endpoint: GET /users/me

Returns current user's data based on `X-User-ID` header.

**Request**:
```bash
curl -X GET http://localhost:8080/users/me \
  -H "X-User-ID: 123456789"
```

**Response**:
```json
{
  "tg_user_id": 123456789,
  "name": "John Doe",
  "phone_number": "+1234567890",
  "tg_link": "https://t.me/johndoe",
  "role": "client",
  "created_at": "2025-12-09T18:00:00Z",
  "cars": [
    {
      "id": 1,
      "brand": "BMW",
      "model": "X5",
      "license_plate": "ABC123",
      "color": "Black",
      "size": "D",
      "is_selected": true
    }
  ]
}
```

## Support

For issues or questions:
1. Check browser console (F12)
2. Review logs in DevTools
3. Check backend logs
4. Create GitHub issue

---

**Last Updated**: December 10, 2025
**Version**: 1.0
