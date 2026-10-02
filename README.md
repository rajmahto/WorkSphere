# 🚀 WorkSphere – AI-Powered Employee Management System

WorkSphere is a full-stack Employee Management System designed to simplify employee, attendance, leave, payroll, and administrative operations through a modern web application.

It provides separate experiences for employees and HR/Admin users with JWT-based authentication and role-based access control.

🔗 **Live Demo:** https://work-sphere-beige.vercel.app/

---

## ✨ Features

### 🔐 Authentication & Security
- User login with JWT authentication
- Role-based authorization
- Employee and HR/Admin access
- Secure password handling
- Protected API endpoints
- Stateless Spring Security configuration

### 👨‍💼 Employee Management
- View employee information
- Manage employee records
- Department-based organization
- Employee profile management

### 🕐 Attendance Management
- Employee check-in
- Employee check-out
- Automatic working-hours calculation
- Attendance history
- Daily attendance status

### 🏖️ Leave Management
- Apply for leave
- View leave balance
- View leave history
- HR/Admin leave approval and rejection
- Automatic leave balance deduction after approval
- Pending and approved leave status tracking

### 💰 Payroll Management
- Employee payroll information
- Salary-related records
- Payroll management for employees

### 🤖 AI Integration
- AI-powered functionality integrated into the application
- Gemini API integration for intelligent features

---

## 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven
- PostgreSQL

### Frontend
- React
- Vite
- JavaScript
- HTML5
- CSS3

### Database
- PostgreSQL
- Neon PostgreSQL

### Deployment
- Backend: Render
- Frontend: Vercel
- Database: Neon PostgreSQL
- Docker

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │   Vite + JavaScript  │
                    └──────────┬───────────┘
                               │
                         REST API / JWT
                               │
                    ┌──────────▼───────────┐
                    │    Spring Boot       │
                    │      Backend         │
                    ├──────────────────────┤
                    │ Spring Security       │
                    │ JWT Authentication    │
                    │ REST Controllers      │
                    │ Service Layer         │
                    │ Spring Data JPA       │
                    └──────────┬───────────┘
                               │
                         PostgreSQL
                               │
                    ┌──────────▼───────────┐
                    │    Neon Database     │
                    └──────────────────────┘





🔄 Leave Management Workflow

Employee
   │
   ├── Apply Leave
   │
   ▼
PENDING
   │
   │ HR/Admin reviews request
   ▼
APPROVED / REJECTED
   │
   ▼
If Approved
   │
   ├── Leave balance updated
   ├── Used leaves increased
   └── Leave history updated




🔑 Authentication Flow

   User Login
    │
    ▼
Spring Boot API
    │
    ▼
Validate Credentials
    │
    ▼
Generate JWT
    │
    ▼
Frontend stores JWT
    │
    ▼
JWT sent with protected API requests
    │
    ▼
JwtAuthFilter validates token
    │
    ▼
Access granted based on user role



📂 Project Structure

WorkSphere/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── worksphere/
│       │
│       └── resources/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── public/
├── Dockerfile
├── pom.xml
├── .gitignore
└── README.md


🚀 Running Locally
1. Clone the repository
git clone https://github.com/rajmahto/WorkSphere.git
cd WorkSphere

2. Run the Spring Boot backend
./mvnw spring-boot:run

The backend will run on:
http://localhost:8080

3. Run the frontend
cd frontend
npm install
npm run dev

The frontend will run on:
http://localhost:5173


🌐 Deployment

WorkSphere is deployed using:

Frontend: Vercel
Backend: Render
Database: Neon PostgreSQL
Containerization: Docker
Live Application

👉 https://work-sphere-beige.vercel.app/

Backend API

👉 https://worksphere-f0vt.onrender.com/

🔒 Security

The application implements:
- JWT-based authentication
- Spring Security
- Role-based authorization
- Protected REST APIs
- Stateless session management
- Environment-based secret configuration
- CORS configuration


📌 Key Learning Outcomes

This project demonstrates practical experience with:

- Spring Boot REST API development
- Spring Security and JWT
- Role-based access control
- Spring Data JPA
- PostgreSQL database integration
- React frontend development
- REST API integration
- Authentication between React and Spring Boot
- Docker-based deployment
- Cloud deployment
- Database management with Neon PostgreSQL

👨‍💻 Author

Raj Mahto

B.Tech Computer Science & Engineering

🔗 GitHub: https://github.com/rajmahto

⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
