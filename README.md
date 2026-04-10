# Smart Attendance Tracker

A modern, full-stack attendance management system built with React, Node.js, Express, and MongoDB.

## Features

- **Role-based Access Control**: Different dashboards for Admin, Teacher, and Student.
- **Teacher Dashboard**: Mark attendance, view student lists, and manage classes.
- **Student Dashboard**: View personal attendance records and profile.
- **Admin Dashboard**: Manage users and assign teachers to classes.
- **Live Attendance Tracking**: Secure and efficient attendance marking.
- **Modern UI**: Built with Tailwind CSS and Shadcn UI components.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed locally or a MongoDB Atlas account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-attendance-tracker.git
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the `server` directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the backend:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

## Deployment

### Backend
Can be deployed to platforms like [Render](https://render.com/), [Railway](https://railway.app/), or [DigitalOcean](https://www.digitalocean.com/).

### Frontend
Can be deployed to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

## License

This project is licensed under the MIT License.
