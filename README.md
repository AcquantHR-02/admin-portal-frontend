# Admin Portal

A modern and responsive Admin Portal built with **Next.js, React, TypeScript, Redux Toolkit, and RTK Query**.

The application provides a centralized interface for managing users, monitoring application analytics, viewing dashboard information, and accessing support resources.

---

## 🚀 Features

### 🔐 Authentication
- Secure login functionality
- JWT-based authentication
- Protected admin routes
- Session-based token management
- Automatic redirection for unauthorized users
- Logout functionality

### 📊 Dashboard
- Overview of application statistics
- User activity information
- Recent activities
- Usage analytics
- User status overview
- Quick actions

### 👥 User Management
- View users
- Search users
- Filter users
- Add new users
- Edit users
- View user details
- Delete users
- Reset user information
- User role management
- Active/Inactive user status

### 📈 Analytics
- Forms summary
- Monthly form submission trends
- Form type distribution
- User form usage
- User status statistics
- Recent activity information

### 🆘 Support Center
- Support information
- Contact support
- Frequently Asked Questions (FAQ)

### 🎨 UI/UX
- Responsive design
- Clean and professional admin interface
- Sidebar navigation
- Modal-based actions
- Loading states
- Error handling
- Responsive layouts for different screen sizes

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**

### State Management

- **Redux Toolkit**
- **React Redux**
- **RTK Query**

### API

- REST APIs
- JWT Authentication

### Development Tools

- Node.js
- npm
- Git
- GitHub
- Docker

---

## 📁 Project Structure

```text
admin-portal/
│
├── public/
│   ├── A-logo.png
│   └── acquanthr-logo.png
│
├── src/
│   │
│   ├── api/
│   │   ├── adminApi.ts
│   │   ├── analyticsApi.ts
│   │   ├── authApi.ts
│   │   ├── baseApi.ts
│   │   └── usersApi.ts
│   │
│   ├── app/
│   │   ├── (admin)/
│   │   │   ├── analytics/
│   │   │   ├── dashboard/
│   │   │   ├── support-center/
│   │   │   ├── users/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── users/
│   │
│   ├── hooks/
│   │   └── Usecurrentuser.ts
│   │
│   ├── providers/
│   │   └── ReduxProvider.tsx
│   │
│   ├── store/
│   │   └── store.ts
│   │
│   └── types/
│       ├── analytics/
│       ├── common/
│       └── user/
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── next.config.ts
├── package.json
├── package-lock.json
└── README.md
