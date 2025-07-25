# 🚢 RORO Ferry Booking System

A full-featured RORO ferry booking platform with user and admin panels, built using:

* **Frontend:** React + Vite
* **Backend:** Node.js + Express
* **Database:** MongoDB
* **Styling:** Tailwind CSS

---

## 📁 Folder Structure

```
roro_ferry-main/
├── backend/           # Express server
├── frontend/          # React (Vite) app
└── README.md
```

---

## 🧑‍💻 How to Run the Project

### 🛠️ Prerequisites

* Node.js (v16+)
* npm or yarn
* MongoDB running locally or cloud (MongoDB Atlas)
* Vite (for frontend)

---

### 1. 🔧 Setup the Backend (Express)

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGODB_URL=your_mongodb_url
STRIPE_SECRET_KEY=your_stripe_key
CASHFREE_API_KEY=your_cashfree_key
```

Run backend server:

```bash
nodemon server
```

---

### 2. ⚡ Setup the Frontend (Vite + React)

```bash
cd ../frontend
npm install
```

Run frontend:

```bash
npm run dev
```

Visit the app at: `http://localhost:5173`

---

## ✅ Main Features

### 👤 User Panel

* Register/Login with email
* View ferry schedules
* Book ferry tickets
* View/download ticket after booking
* OTP verification for actions
* Payment integration (Cashfree)

### 🛠️ Admin Panel

* Admin login
* View/manage users
* Add/update/delete ferry schedules
* View all bookings
* View feedback

### 📧 Email System

* OTP sent to email for verification
* Booking confirmation emails

---

## 🧪 Technologies Used

| Tech         | Description           |
| ------------ | --------------------- |
| React        | Frontend UI           |
| Vite         | Fast React dev server |
| Tailwind CSS | Styling               |
| Express.js   | Backend API           |
| MongoDB      | Database              |
| Nodemailer   | Email service         |
| Cashfree     | Payment integration   |

---

---

## 🛡️ Security Notes

* `.env` file is **excluded** from Git and should never be committed.
* Push protection is enabled on GitHub to block secrets from being exposed.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---
