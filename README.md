# CampusGate - Smart Gate Pass Management System 🛡️

**CampusGate** is a comprehensive, digital solution designed to streamline the gate pass process for educational institutions. It facilitates seamless communication between students, wardens, parents, and security personnel, ensuring safety, efficiency, and accountability.

> **🚀 Calls for Collaboration!**  
> This project is open for contributions. We are looking for developers to help find bugs, improve code quality, and add new features. If you find an issue, please open a PR!

---

## ✨ Key Features

- **For Students:**
  - Easy digital outing requests.
  - Real-time status tracking.
  - History of past outings.
  - QR Code generation for gate exit/entry.

- **For Wardens/Authorities:**
  - Digital dashboard for reviewing requests.
  - One-click approval/rejection.
  - Insights into student movement.

- **For Parents:**
  - SMS/Notification alerts (Planned).
  - Approval workflow for specific outing types.

- **For Security (Watchman):**
  - QR Code scanner implementation.
  - Real-time verification of passes.
  - Entry/Exit logging.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, ShadCN UI, Framer Motion.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB.
- **Authentication:** JWT (JSON Web Tokens).

---

## 📂 Project Structure

The project is organized into two main directories:

- **`/client`**: The React frontend application.
- **`/server`**: The Node.js/Express backend API.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas connection string)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/sameerredy213/campus-gate-pass.git
cd campus-gate-pass
```

### 2. Backend Setup
Navigate to the server directory, install dependencies, and configure environment variables.

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-gate-pass
JWT_SECRET=your_super_secret_key
# Add other keys as needed
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies.

```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:8080`.

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1.  **Fork the repository.**
2.  **Create a new branch** (`git checkout -b feature/AmazingFeature`).
3.  **Commit your changes** (`git commit -m 'Add some AmazingFeature'`).
4.  **Push to the branch** (`git push origin feature/AmazingFeature`).
5.  **Open a Pull Request.**

### 🐛 Found a Bug?
Please open an issue in the repository describing the bug, how to reproduce it, and any screenshots if possible.

---

## 🚀 Deployment (Vercel)

This project is configured for deployment on Vercel.

1.  **Import Project**: Log in to Vercel and import this repository.
2.  **Environment Variables**: You **MUST** set the following variables in the Vercel Project Settings:
    - `MONGO_URI`: Your MongoDB connection string (Atlas recommended).
    - `JWT_SECRET`: A secure random string for authentication.
    - `CLOUDINARY_CLOUD_NAME`: (If used)
    - `CLOUDINARY_API_KEY`: (If used)
    - `CLOUDINARY_API_SECRET`: (If used)
3.  **Build Settings**: Vercel should automatically detect the settings, but if prompted:
    - **Build Command**: `cd client && npm run build`
    - **Output Directory**: `client/dist`
    - **Install Command**: `npm install`

The backend API is configured to run as Serverless Functions via the `/api` directory.

### ❓ Troubleshooting Deployment
- **404 on API**:
    - Check `/api/debug.js?health-check=true` to verify environment variables.
    - The server now listens on both `/api/*` and `/*` to handle Vercel routing quirks.
    - If you see `Not Found - /some/path`, the server is running but the route is wrong.
- **500 Error**:
    - Check Vercel Function Logs.
    - Ensure MongoDB URI is valid and whitelisted (0.0.0.0/0).
- **First Time Login Failed**:
    - The database might be empty. Visit `/api/system/seed` (e.g., `https://yourapp.vercel.app/api/system/seed`) once to create the initial admin account.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Sameer Reddy](https://github.com/sameerredy213)
