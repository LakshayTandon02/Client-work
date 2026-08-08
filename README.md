# 🏥 KH Hospital — Modern Healthcare Management Platform

<p align="center">
  <strong>A modern, responsive and intelligent hospital management website built with React, TypeScript, Firebase and AI.</strong>
</p>

<p align="center">
  <a href="https://github.com/LakshayTandon02/Client-work">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Firebase-Backend-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase">
</p>

---

## 📌 Overview

**KH Hospital** is a modern healthcare web application designed to provide patients with a smooth digital experience for exploring hospital services, departments, doctors and appointments.

The platform combines a responsive React frontend with Firebase-powered functionality, authentication, an administrative dashboard and an integrated AI chatbot.

The project is structured as a scalable single-page application using **React, TypeScript, Vite, Tailwind CSS and React Router**.

---

## ✨ Key Features

### 🏠 Hospital Website

* Modern responsive homepage
* Hospital information and services
* About section
* Departments listing
* Doctors directory
* Contact section
* Responsive navigation and footer
* Search functionality
* Patient-friendly UI

### 📅 Appointment Management

* Dedicated appointment page
* Patient appointment workflow
* Doctor/department related information
* Structured appointment interface

### 🔐 Authentication

* User authentication flow
* Protected user functionality
* Profile management
* Firebase-based authentication integration

### 👨‍⚕️ Doctor & Department Management

* Browse available doctors
* Explore hospital departments
* Organized healthcare information
* Dedicated pages for doctors and departments

### 🛠️ Admin Dashboard

* Dedicated administrator dashboard
* Centralized management interface
* Authentication-aware admin functionality
* Designed for hospital administration workflows

### 🤖 AI Chatbot

The application includes an integrated AI chatbot component to provide users with an interactive assistant experience.

The project includes Google Gemini integration through the `@google/genai` package and a configurable `GEMINI_API_KEY`.

### 🎨 Modern UI

* Responsive design
* Tailwind CSS
* shadcn/ui components
* Lucide icons
* Motion-based animations
* Toast notifications
* Modern typography using Geist
* Accessible component-based architecture

---

## 🧰 Tech Stack

| Technology                  | Purpose                           |
| --------------------------- | --------------------------------- |
| ⚛️ React 19                 | Frontend framework                |
| 🔷 TypeScript               | Type-safe development             |
| ⚡ Vite                      | Development & build tooling       |
| 🎨 Tailwind CSS             | Styling                           |
| 🧩 shadcn/ui                | UI components                     |
| 🔥 Firebase                 | Backend services & authentication |
| 🤖 Google Gemini            | AI chatbot functionality          |
| 🛣️ React Router            | Client-side routing               |
| 🎭 Motion                   | UI animations                     |
| 🎯 Lucide React             | Icons                             |
| 📊 Recharts                 | Data visualization                |
| 🔔 Sonner                   | Toast notifications               |
| 📅 React Day Picker         | Date selection                    |
| 🧹 ESLint/TypeScript checks | Code quality                      |

The project's dependency configuration includes React 19, Vite, Firebase, Google GenAI, Tailwind CSS, React Router, Motion, Recharts and several supporting UI libraries.

---

## 🏗️ Application Architecture

```text
                         ┌──────────────────────┐
                         │      KH Hospital     │
                         │      Web Platform    │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
             React Frontend                    Firebase
                    │                               │
        ┌───────────┼───────────┐             Authentication
        │           │           │                    │
      Pages      Components   Contexts            Database
        │           │           │
        │           │           └──── AuthProvider
        │           │
        │           ├──── Navbar
        │           ├──── Footer
        │           ├──── Chatbot
        │           ├──── SearchBar
        │           └──── Testimonials
        │
        ├──── Home
        ├──── About
        ├──── Departments
        ├──── Doctors
        ├──── Appointment
        ├──── Contact
        ├──── Authentication
        ├──── Profile
        └──── Admin Dashboard
```

The main application uses `BrowserRouter`, route-based page rendering and an `AuthProvider` wrapping the application.

---

## 📂 Project Structure

```text
Client-work/
│
├── src/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── Chatbot.tsx
│   │   ├── Footer.tsx
│   │   ├── Logo.tsx
│   │   ├── Navbar.tsx
│   │   ├── SearchBar.tsx
│   │   └── Testimonials.tsx
│   │
│   ├── contexts/
│   │   └── AuthContext
│   │
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── Appointment.tsx
│   │   ├── Auth.tsx
│   │   ├── Contact.tsx
│   │   ├── Departments.tsx
│   │   ├── Doctors.tsx
│   │   ├── Home.tsx
│   │   └── Profile.tsx
│   │
│   ├── App.tsx
│   ├── data.ts
│   ├── firebase.ts
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

The repository currently separates reusable components, page-level views and application contexts under `src`, with dedicated files for Firebase configuration and application routing.

---

## 🛣️ Application Routes

| Route          | Page                 |
| -------------- | -------------------- |
| `/`            | Home                 |
| `/about`       | About Hospital       |
| `/departments` | Hospital Departments |
| `/doctors`     | Doctors              |
| `/contact`     | Contact              |
| `/appointment` | Appointment Booking  |
| `/admin`       | Admin Dashboard      |
| `/auth`        | Authentication       |
| `/profile`     | User Profile         |

These routes are configured in `src/App.tsx` using React Router.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/LakshayTandon02/Client-work.git
```

### 2. Navigate to the Project

```bash
cd Client-work
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="YOUR_APP_URL"
```

The repository provides a `.env.example` containing configuration placeholders for the Gemini API key and application URL.

> ⚠️ **Important:** Never commit real API keys or other secrets to GitHub.

### 5. Start Development Server

```bash
npm run dev
```

The configured development script starts Vite on port `3000`.

Open:

```text
http://localhost:3000
```

---

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Create production build
npm run build

# Preview production build
npm run preview

# TypeScript check
npm run lint

# Remove production build
npm run clean
```

These scripts are defined in the project's `package.json`.

---

## 🔥 Firebase Configuration

The application contains Firebase configuration and Firestore security rules.

Relevant files:

```text
src/firebase.ts
firebase-applet-config.json
firebase-blueprint.json
firestore.rules
```

Firebase is used as part of the application's backend infrastructure, including authentication-related functionality.

For production deployment, configure Firebase credentials and security rules according to your Firebase project.

---

## 🤖 AI Integration

The project includes Google Gemini integration using:

```text
@google/genai
```

The AI functionality is exposed through the application's chatbot component.

Basic architecture:

```text
User
  │
  ▼
Chatbot UI
  │
  ▼
Gemini API
  │
  ▼
AI Response
  │
  ▼
Chatbot UI
```

The Gemini API key is configured through the environment rather than being hard-coded into the application.

---

## 🔐 Security Considerations

For production usage:

* Keep API keys inside environment variables
* Never commit `.env` files containing secrets
* Configure Firebase Authentication properly
* Review Firestore security rules
* Restrict administrative functionality to authorized users
* Validate user input on both client and backend layers
* Use HTTPS in production

---

## 🎯 Use Cases

KH Hospital can be adapted for:

* 🏥 Hospitals
* 🩺 Clinics
* 👨‍⚕️ Medical practices
* 📅 Appointment booking systems
* 🧑‍⚕️ Doctor directories
* 🏢 Healthcare organizations
* 🤖 AI-powered healthcare assistants

---

## 🚀 Future Improvements

Potential future enhancements include:

* 📱 Dedicated mobile application
* 🔔 Appointment reminders
* 📧 Email/SMS appointment notifications
* 💳 Online payment integration
* 📄 Digital medical records
* 🧑‍⚕️ Doctor availability scheduling
* 📊 Advanced admin analytics
* 🗓️ Real-time appointment calendar
* 💬 Enhanced AI healthcare assistant
* 🌐 Multi-language support
* ☁️ Production cloud deployment
* 🔒 Advanced role-based access control

---

## 📸 Screenshots

Add screenshots of the application here:

```text
screenshots/
├── home.png
├── departments.png
├── doctors.png
├── appointment.png
├── dashboard.png
├── profile.png
└── chatbot.png
```

Example:

```markdown
![Homepage](screenshots/home.png)
![Doctors](screenshots/doctors.png)
![Appointment](screenshots/appointment.png)
```

---

## 🧪 Development

The project follows a component-based architecture where reusable UI elements are separated from page-level views.

This makes the application easier to:

* Maintain
* Scale
* Debug
* Reuse components
* Add new hospital features
* Extend authentication and administrative functionality

---

## 📈 Project Highlights

### Frontend Engineering

* Component-driven React architecture
* TypeScript for safer development
* Client-side routing
* Responsive UI
* Reusable components

### Backend & Cloud

* Firebase integration
* Authentication architecture
* Firestore rules
* Environment-based configuration

### AI Engineering

* Gemini API integration
* Interactive AI chatbot
* Environment-based API configuration

### UI/UX

* Modern healthcare interface
* Responsive layouts
* Animated interactions
* Toast notifications
* Search and navigation components

---

## 🤝 Contributing

Contributions, suggestions and improvements are welcome.

```bash
# Fork the repository

# Create a feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "Add your feature"

# Push the branch
git push origin feature/your-feature

# Open a Pull Request
```

---

## 📄 License

This project is intended for demonstration, development and client-work purposes.

If you plan to reuse or commercially distribute the project, review and define an appropriate license before doing so.

---

## 👨‍💻 Author

### Lakshay Tandon

**Computer Science Engineer | AI & Full-Stack Developer**

* GitHub: [@LakshayTandon02](https://github.com/LakshayTandon02)
* Repository: [Client-work](https://github.com/LakshayTandon02/Client-work)

---

<p align="center">
  ⭐ If you find this project useful, consider giving it a star!
</p>

<p align="center">
  Built with ❤️ using React, TypeScript, Firebase & AI
</p>
