# Learning Management System (LMS)

A comprehensive, full-stack Learning Management System built with Django REST Framework and React. This platform provides role-based access control for administrators, instructors, and students with complete course management, enrollment tracking, and user authentication features.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [User Roles & Permissions](#user-roles--permissions)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)

---

## Project Overview

This Learning Management System is a modern web application that enables educational institutions and organizations to manage courses, track student progress, and facilitate online learning. The system supports three distinct user roles with specific permissions and dashboards tailored to their needs.

### Key Objectives

- **Secure Authentication**: JWT-based authentication with password reset functionality
- **Role-Based Access Control**: Different interfaces and permissions for admins, instructors, and students
- **Course Management**: Complete CRUD operations for courses, lessons, and materials
- **Progress Tracking**: Real-time monitoring of student enrollment and course completion
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

---

## Features

### Authentication & Authorization

- **User Registration** with role selection (Admin, Instructor, Student)
- **JWT-based Login** with secure token management
- **Password Reset** with email-based token verification
- **Forgot Password** functionality
- **Profile Management** - View and update user information
- **Protected Routes** - Role-based access control

### Admin Features

- **Complete System Dashboard**
  - Total users, courses, enrollments statistics
  - Instructor overview with course counts
  - Course enrollment details
- **Course Management**
  - Create courses and assign instructors
  - Edit course details (title, description, price, duration)
  - Delete courses
  - Reassign instructors
- **Category Management**
  - Create and manage course categories
  - Admin-only access
- **User Management**
  - View all users by role
  - Monitor system-wide statistics
- **Student Monitoring**
  - View enrolled students for any course
  - Track progress and completion rates

### Instructor Features

- **Instructor Dashboard**
  - View assigned courses
  - Track total students enrolled
  - Course-specific analytics
- **Course Content Management**
  - Add, edit, and delete lessons
  - Add, edit, and delete course materials
  - Manage course structure
- **Student Monitoring**
  - View students enrolled in their courses
  - Track individual student progress
  - Monitor completion rates and marks

### Student Features

- **Student Dashboard**
  - Personalized learning overview
  - Progress tracking for each course
  - Completion status and statistics
- **Course Enrollment**
  - Browse available courses
  - Search and filter by category
  - Enroll in courses
- **Learning Portal**
  - View enrolled courses
  - Access course details, lessons, and materials
  - Track personal progress
- **Course Details**
  - View course overview
  - Access lessons and materials
  - See instructor information

### Course Management

- **Search & Filter**
  - Search by course title or description
  - Filter by category
  - Pagination support
- **Course Details**
  - Comprehensive course information
  - Instructor details
  - Duration and pricing
  - Category classification
- **Lessons**
  - Structured lesson content
  - Video support
  - Numbered organization
- **Materials**
  - Downloadable resources
  - Structured documentation

### Analytics & Reporting

- **Dashboard Statistics**
  - User count by role
  - Course enrollment numbers
  - Progress tracking
- **Course Analytics**
  - Enrollment counts per course
  - Student progress tracking
  - Completion rates
- **Student Progress**
  - Visual progress bars
  - Percentage completion
  - Mark tracking
  - Certificate readiness

---

## User Roles & Permissions

## Admin

#### CAN DO:
-  Full system access
- Create, edit, delete courses
- Assign instructors to courses
- Create and manage categories
- View all users and statistics
- Monitor all course enrollments
#### CAN NOT DO:
- Create lessons/materials directly

### Instructor (Teacher)

#### CAN DO:
- View assigned courses
- Create, edit, delete lessons in their courses
- Create, edit, delete materials in their courses
- View students enrolled in their courses
- Track student progress
#### CAN NOT DO:
- Create courses
- Categories
- Access other instructors' courses

### Student

#### CAN DO:
- Browse all available courses
- Search and filter courses
- Enroll in courses
- View enrolled courses
- Access lessons and materials
- Track personal progress
#### CAN NOT DO:
- Create or edit any content
- View other students' progress

---
## Tech Stack

### Backend

- **Framework**: Django 4.x
- **API**: Django REST Framework
- **Authentication**: djangorestframework-simplejwt
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **CORS**: django-cors-headers
- **Email**: Django's built-in email system

### Frontend

- **Framework**: React 
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Routing**: Custom routing implementation

### Development Tools

- **Version Control**: Git
- **Package Manager**: npm (frontend), pip (backend)
- **Code Editor**: VS Code (recommended)

---


## Setup Instructions

### Prerequisites

- **Python** 
- **Node.js** 
- **npm** 
- **Git**

### Backend Setup

1. **Clone the repository**

```bash
git clone https://github.com/Baktiyar-Sagar/Learning-Management-System.git
cd lms
```

2. **Create and activate virtual environment**

```bash
# Windows
python -m venv env
env\Scripts\activate

# macOS/Linux
python3 -m venv env
source env/bin/activate
```

3. **Install Python dependencies**

```bash
cd backend
pip install -r requirements.txt
```

4. **Configure environment variables (optional)**

Create a `.env` file in the `backend/` directory:

```bash
EMAIL_HOST_USER='baktiyar.sagar@gmail.com'
EMAIL_HOST_PASSWORD='xmxaisjmhaealghi'
```


5. **Run the development server**

```bash
python manage.py runserver
```

Backend will be available at `http://127.0.0.1:8000/`


### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure API URL (if needed)**

Edit `src/api/axios.js` and update the base URL:
For me it is : `http://127.0.0.1:8000/`
It can also be: `http://localhost:8000/` 

```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/';
```

4. **Run the development server**

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000/api
- **Django Admin**: http://127.0.0.1:8000/admin

### Default Login Credentials

After setup, you can login with:

- **Admin**: Username and password you created with `createsuperuser` or if you use the default DB (For my instance -> `username: admin , password: 123`)
- **Teacher**: you can create on your own
- **Student**: you can create on your own 

  `NOTE: Please ensure you use a valid email address during registration. This allows you to securely reset your password and regain access to your account `

---


## Configuration

### Email Configuration

For deployment, update `backend/settings.py`:

#### Using Gmail

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com' # Need to change 
EMAIL_HOST_PASSWORD = 'your-app-password' # Need to change 
DEFAULT_FROM_EMAIL = 'LMS System <noreply@yourdomain.com>'
```

**Note**: For Gmail, enable 2-Factor Authentication and generate an App-Specific Password (Using: https://myaccount.google.com/apppasswords ).


### CORS Configuration

Update `backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:8000/",
]
```

### Common Issues

**Cannot create course as admin (Superuser i.e. Django Admin account)**
- Verify admin user (superuser) has `role='admin'` (in database, change the superusers role from http://127.0.0.1:8000/admin/)
- Check backend permissions

### Some created account information for testing:

```
Teacher:
  username: Alam
  password: Alam123

Admin: 
  username: admin
  password: 123

Student:
  username: salim
  password: salim123
```

---

## API Documentation

### Authentication Endpoints

```
POST   /api/auth/register/                 # User registration
POST   /api/auth/login/                    # User login
GET    /api/auth/profile/                  # Get user profile
PUT    /api/auth/profile/                  # Update user profile
POST   /api/auth/forgot-password/          # Request password reset
POST   /api/auth/reset-password/<uid>/<token>/  # Reset password
GET    /api/auth/verify-reset-token/<uid>/<token>/  # Verify token
GET    /api/auth/users/                    # List users (admin only)
```

### Dashboard Endpoints

```
GET    /api/dashboard/summary/             # Get dashboard statistics
```

### Course Endpoints

```
GET    /api/lms/courses/                   # List all courses
POST   /api/lms/courses/                   # Create course (admin only)
GET    /api/lms/courses/{id}/              # Get course details
PUT    /api/lms/courses/{id}/              # Update course (admin only)
DELETE /api/lms/courses/{id}/              # Delete course (admin only)
GET    /api/lms/courses/{id}/students/     # Get enrolled students
```

### Category Endpoints

```
GET    /api/lms/categories/                # List all categories
POST   /api/lms/categories/                # Create category (admin only)
```

### Lesson Endpoints

```
GET    /api/lms/courses/{course_id}/lessons/           # List lessons
POST   /api/lms/courses/{course_id}/lessons/           # Create lesson
GET    /api/lms/courses/{course_id}/lessons/{id}/      # Get lesson
PUT    /api/lms/courses/{course_id}/lessons/{id}/      # Update lesson
DELETE /api/lms/courses/{course_id}/lessons/{id}/      # Delete lesson
```

### Material Endpoints

```
GET    /api/lms/courses/{course_id}/materials/         # List materials
POST   /api/lms/courses/{course_id}/materials/         # Create material
GET    /api/lms/courses/{course_id}/materials/{id}/    # Get material
PUT    /api/lms/courses/{course_id}/materials/{id}/    # Update material
DELETE /api/lms/courses/{course_id}/materials/{id}/    # Delete material
```

### Enrollment Endpoints

```
GET    /api/lms/enrollments/               # List user enrollments
POST   /api/lms/enrollments/               # Enroll in course
```

---


## Screenshots

### Login Page and Registration Page

Clean authentication interface with forgot password option.

![login page](image-1.png)

Registration interface

![Registration page](image-2.png)

Reset password: click Forget password link

step-1: Use valid gmail that was used for registration

![alt text](image-19.png)

step-2: check the email inbox and click the link for reset password

![alt text](image-21.png)

step-3:after clicking the link this interface will show up, Now Reset password in 15 minutes

![alt text](image-20.png)
### Admin's interface:

Dashboard:

![alt text](admin_dashboard.png)

Check Student ( in a Modal ): Dashboard -> Courses & Enrollment Details -> Actions -> click "View Students:" button

![alt text](image-3.png)

Courses List:

![alt text](admin_courses.png)

Create Course: Courses -> click "+ Create Course' button

![alt text](admin_create_course.png)

Category:

![alt text](admin_category.png)

Create new category: 

![alt text](image-7.png)

Profile Page:

![alt text](image-8.png)


### Instructor's interface:

Instructors Dashboard:

![alt text](image-15.png)

View students for a particular course: click "view" button in dashboard page

![alt text](image-18.png)

Instructor Add lessons and materials:

![alt text](image-16.png)
![alt text](image-17.png)

### Student's interface
Dashboard:

![alt text](image-10.png)

Student Enrollment:

![alt text](image-11.png)

Enrolled Course Details:

![alt text](image-12.png)
![alt text](image-14.png)
Students Courses:

![alt text](image-13.png)

---


## Author

- **Md.Baktiyar -Ul- Alam** 

---

## Future Enhancements

- Real-time notifications
- Video streaming integration
- Quiz and assessment system
- Discussion forums
- Certificate generation
- Payment integration
- Advanced analytics
- Dark mode

---
