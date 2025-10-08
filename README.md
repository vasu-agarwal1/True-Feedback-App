# 💣 Truth Bombs | A Full-Stack Anonymous Feedback App

**Truth Bombs** is a modern, full-stack anonymous messaging platform built to demonstrate proficiency in the **MERN stack with Next.js**.  
It allows users to receive honest, unfiltered feedback through a unique, shareable profile link — showcasing a complete end-to-end development cycle from database design to a dynamic, secure frontend.


---

## 🚀 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Frontend** | React + TypeScript + Tailwind CSS |
| **Backend** | Next.js API Routes (Node.js) |
| **Database** | MongoDB + Mongoose |
| **Authentication** | NextAuth.js (JWT-based) |
| **Email Service** | Resend API (for email verification) |
| **Validation & Forms** | Zod + React Hook Form |
| **UI Components** | Shadcn/UI |

---

## 🧩 Features

- 🔒 **Secure Authentication** using NextAuth.js and JWT tokens  
- 📧 **Email Verification** via Resend API  
- 🌐 **Unique Shareable Links** (e.g., `/u/username`)  
- 💬 **Anonymous Messaging** — users can receive "truth bombs" securely  
- 🧭 **Dashboard** to view, manage, and delete messages  
- ⚙️ **User Settings** — control message acceptance preferences  
- 💡 **Server-Side + Client-Side Rendering** hybrid architecture for performance  

---

## 🧠 Key Challenges & Solutions

### 1️⃣ User ID Not Passed to API Routes
**Challenge:** Initial data fetching failed as the user's `_id` wasn’t correctly passed to the server.  
**Solution:** Updated NextAuth.js callbacks (`jwt` and `session`) to serialize the MongoDB `_id` into the JWT, ensuring it’s available for authenticated API requests.

---

### 2️⃣ Silent Failure in Settings Update
**Challenge:** A settings update API wasn’t working, and no error appeared in the `try...catch` block.  
**Solution:** Discovered a missing `await` in the `dbConnect()` call causing a race condition. Adding `await` ensured the database was connected before operations.

---

### 3️⃣ Data Inconsistency Across Stack
**Challenge:** Inconsistent property names (e.g., `isAcceptingMessages`) across model, API, and frontend.  
**Solution:** Standardized schema properties across the stack for consistent data flow and reliable state management.

---

## ⚙️ How It Works

1. **Sign Up & Verify Email:**  
   Users sign up and verify via a link sent using the Resend API.

2. **Get a Unique Link:**  
   A personal page (`/u/username`) is generated and shown on the dashboard.

3. **Receive Feedback:**  
   Anyone with the link can drop an anonymous message.

4. **Manage Messages:**  
   Users can view and delete messages in a private dashboard.

---
