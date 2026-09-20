# Pizzelo — Pizza Delivery Full-Stack Application

Pizzelo is a full-stack pizza delivery web app built for the **Oasis Infobyte Summer Internship Program (OIBSIP)** — Web Development Track, Level 3, Task 1. Customers can build a custom pizza from scratch, order one of ten signature presets, pay securely via Razorpay, and track their order live — while admins manage inventory and fulfill orders from a dedicated dashboard.

**🔗 Live App:** [https://pizzelo.vercel.app](https://pizzelo.vercel.app)
**⚙️ Backend API:** [https://pizzelo-api.onrender.com](https://pizzelo-api.onrender.com)

> **Note:** The backend is hosted on Render's free tier, which spins down after periods of inactivity. The very first request after idle time may take 30–60 seconds to respond while it wakes up — subsequent requests are fast.

---

##  Features

### Customer
- Email/password registration with email verification, login, and forgot/reset password flow
- **Pizza Builder** — a 4-step guided flow (base, sauce, cheese, vegetables) with a live, layered visual preview that assembles as you pick ingredients
- **Menu** — 10 preset signature pizzas with real photos; order one instantly or use it as a starting point
- Secure checkout via **Razorpay** (test mode), with server-side signature verification before any order is created
- **My Orders** — a visual progress tracker (Order Received → In Kitchen → Sent to Delivery) that updates live
- Contact form that emails the site admin directly

### Admin
- Separate secure admin login, isolated from customer auth
- **Inventory management** — add, edit, and track stock levels for every ingredient
- **Automated low-stock email alerts**, sent daily via a scheduled job
- **Order management** — view all incoming orders and update their status, which customers see reflected in real time

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React (Vite)                                     |
| Backend    | Node.js, Express                                 |
| Database   | MongoDB Atlas                                    |
| Auth       | JWT (separate customer and admin roles)          |
| Payments   | Razorpay (test mode, with signature verification)|
| Email      | Mailjet (transactional email API, sent over HTTPS) |
| Scheduling | node-cron (daily low-stock alerts)               |
| Hosting    | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---



## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas connection string
- A Mailjet account (free tier) with a verified sender email, API Key, and Secret Key
- Razorpay test API keys

### 1. Clone the repo
```bash
git clone https://github.com/Mona-Beydoun/OIBSIP.git
cd OIBSIP/WebDev-L3-Pizzelo
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in `server/` with:
```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_verified_sender_email
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_API_SECRET=your_mailjet_secret_key
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

> **Note:** Email is sent via Mailjet's HTTPS API rather than traditional SMTP. This is a deliberate choice — some hosting providers (Render's free tier included) block outbound SMTP ports entirely, so an HTTP-based email API is what actually works in production.

Run the server:
```bash
npm run dev
```
Server runs on `http://localhost:5000`.

### 3. Frontend setup
```bash
cd ../client
npm install
```

Create a `.env` file in `client/` with:
```
VITE_API_URL=http://localhost:5000/api
```

Run the client:
```bash
npm run dev
```
Client runs on `http://localhost:5173`.

---

##  Test Payment Details (Razorpay Test Mode)

| Field         | Value                          |
|---------------|---------------------------------|
| Card Number   | 5267 3181 8797 5449 (Mastercard) |
| Expiry        | Any future date                |
| CVV           | Any 3 digits                   |
| OTP           | 1234                            |
| Mobile Number | Any valid-looking 10-digit number (e.g. 9123456789) |

---

## Deployment Notes

- **Frontend** is deployed on Vercel with a `vercel.json` rewrite rule so client-side routing (React Router) works correctly on direct page loads and refreshes.
- **Backend** is deployed on Render's free tier. Outbound SMTP traffic (ports 25/465/587) is blocked on Render's free instances, so transactional email (registration verification, password reset, low-stock alerts) is sent via **Mailjet's HTTPS API** instead of a traditional SMTP connection.
- CORS on the backend is restricted to the production frontend origin.
- The Render free tier spins down after ~15 minutes of inactivity; the first request afterward may take 30–60 seconds to respond while it wakes up.

##  Project Structure

```
WebDev-L3-Pizzelo/
  client/     React (Vite) frontend
  server/     Node.js + Express backend
```

See inline code comments and controller/route naming for a detailed breakdown of each module.

---

##  Author

Built by **Mona Beydoun** as part of the OIBSIP Web Development internship track.
