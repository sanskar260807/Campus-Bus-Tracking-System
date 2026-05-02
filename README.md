# 🚌 Campus Bus Tracking System

<div align="center">

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-orange)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)
![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Map](https://img.shields.io/badge/Map-Leaflet.js-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A real-time web application for tracking campus buses, monitoring crowd levels, and calculating ETAs — built for Netaji Subhas University, Jamshedpur.**

</div>

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Database Structure](#database-structure)
- [Screenshots](#screenshots)
- [Team](#team)

---

## 📖 About the Project

The **Campus Bus Tracking System** is a final year BCA project developed at **Netaji Subhas University, Jamshedpur (Jharkhand)**. It solves a real problem faced by students — uncertainty about bus locations, arrival times, and crowd status.

The system allows:
- **Students** to track buses live on a map and see ETA
- **Admins** to update crowd levels and manage bus data
- **Super Admins** to manage users and the full system

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ Live Map Tracking | Buses move in real-time on an interactive Leaflet.js map |
| ⏱️ ETA Calculation | Estimated arrival time based on distance and speed |
| 👥 Crowd Monitoring | Admin can set crowd level — Low / Medium / High |
| 🔐 Role-Based Login | Separate access for Admin and Super Admin |
| 🚌 Multi-Bus Support | Track a single bus or all buses simultaneously |
| 📍 Stop Markers | All route stops displayed on the map with popups |
| 📱 Responsive UI | Dark-themed professional interface |

---

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- [Leaflet.js](https://leafletjs.com/) — Interactive map rendering
- Google Fonts — Space Grotesk, DM Mono

### Backend
- [Node.js](https://nodejs.org/) — Runtime environment
- [Express.js](https://expressjs.com/) — Web framework
- [CORS](https://www.npmjs.com/package/cors) — Cross-origin support

### Database
- [MongoDB](https://www.mongodb.com/) — NoSQL database (local instance)
- [Mongoose](https://mongoosejs.com/) — ODM for MongoDB

---

## 📁 Project Structure

```
Campus-Bus-Tracking-System/
│
├── Client/                   # Frontend files
│   ├── index.html            # Main tracking dashboard
│   ├── login.html            # Login page
│   ├── script.js             # Map logic, bus tracking, crowd updates
│   └── style.css             # Dark UI theme and layout
│
├── app.js                    # Express server + API routes
├── package.json              # Node.js dependencies
├── .gitignore                # Ignores node_modules, .env
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v14 or above)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)
- A modern web browser

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/sanskar260807/Campus-Bus-Tracking-System.git
cd Campus-Bus-Tracking-System
```

**2. Install dependencies**
```bash
npm install
```

**3. Start MongoDB** (if not already running)
```bash
mongod
```

**4. Start the backend server**
```bash
node app.js
```
Server runs at: `http://localhost:5000`

**5. Open the frontend**

Open `Client/login.html` in your browser, or use VS Code Live Server.

### Default Login

```
Username: admin
Password: admin123
Role: admin
```
> You can add users directly into MongoDB or via a seed script.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/login` | Authenticate user, returns role |
| `GET` | `/get-bus` | Fetch all bus routes and stops |
| `POST` | `/add-bus` | Add a new bus route (admin only) |
| `POST` | `/update-crowd` | Update crowd level for a bus |
| `GET` | `/get-crowd` | Get latest crowd level |

### Example — Add a Bus (POST `/add-bus`)

```json
{
  "busNo": "BUS-01",
  "routeName": "Main Gate Route",
  "color": "#3b82f6",
  "stops": [
    { "name": "Main Gate", "lat": 22.8046, "lng": 86.2029 },
    { "name": "Library",   "lat": 22.8060, "lng": 86.2045 },
    { "name": "Canteen",   "lat": 22.8075, "lng": 86.2060 },
    { "name": "Hostel",    "lat": 22.8090, "lng": 86.2080 }
  ]
}
```

---

## 🗄️ Database Structure

### Collections in `busDB`

**buses**
```
busNo       (String)   — Bus number e.g. "BUS-01"
routeName   (String)   — Route name
color       (String)   — Route line color (hex)
stops       (Array)    — [ { name, lat, lng } ]
```

**crowds**
```
level       (String)   — "Low" | "Medium" | "High"
_id         (ObjectId) — Auto-generated (used for latest query)
```

**users**
```
username    (String)   — Login username
password    (String)   — Login password
role        (String)   — "admin" | "superadmin"
```

---

## 📸 Screenshots

> _Add screenshots of your running project here_

| Login Page | Dashboard | Map View |
|---|---|---|
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

**To add screenshots:**
1. Take a screenshot of your running project
2. Save it inside a `screenshots/` folder in your repo
3. Replace `_(screenshot)_` above with: `![Login](screenshots/login.png)`

---

## 👨‍💻 Team

| Role | Responsibility |
|---|---|
| Frontend Developer | UI design, Leaflet.js map, ETA logic |
| Backend Developer | Express APIs, authentication, crowd updates |
| Database Manager | MongoDB schema, data management |

**Institution:** Netaji Subhas University, Jamshedpur, Jharkhand
**Course:** Bachelor of Computer Applications (BCA) — 6th Semester
**Academic Year:** 2024–25

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by the Campus Bus Tracking Team — NSU Jamshedpur
</div>
