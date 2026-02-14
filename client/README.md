# 🚐 CampingTour

**CampingTour** is a full-stack web application designed for camper van rentals. It features a modern booking inquiry system, member authentication, and a digital credit card authorization process with electronic signatures.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-development-orange)

## 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)

---

## 🛠 Tech Stack

### Frontend (Client)
- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Utilities:** React Signature Canvas (for digital signatures)

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt
- **Services:** Nodemailer (Email notifications), PDFKit (PDF generation)

---

## 📂 Project Structure

This project follows a **Monorepo** architecture, separating the client and server logic within a single repository.

```text
camping-tour/
├── client/              # Frontend application (React + Vite)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/              # Backend application (Node.js + Express)
│   ├── config/          # Database configuration
│   ├── routes/          # API routes
│   ├── services/        # Email & PDF logic
│   └── server.js        # Entry point
│
└── README.md            # Project documentation