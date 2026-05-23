# ARC Enterprises - Secure Role-Based Web Application

A secure, premium role-based web application built with **React**, **Firebase Firestore**, **Firebase Authentication**, and **Vercel/Firebase Hosting**.

---

## Deployment & Repository Details

* **Live Hosted URL**: [https://arc-enterprises-platform.vercel.app/](https://arc-enterprises-platform.vercel.app/) *(or your custom deployed URL)*
* **GitHub Repository**: [https://github.com/Arcofficial4545/ARC_Enterprises_web_task](https://github.com/Arcofficial4545/ARC_Enterprises_web_task)

---

## Assignment Compliance Checklist (Assignment 04)

### 1. Firebase Authentication Integration (Task 1)
* **Email & Password Sign Up / Sign In**: Full form controls, user state management, and validation.
* **Google Sign-In**: Integrated using GoogleAuthProvider via popup authentication.
* **Reset Password**: Dynamic password recovery sends reset emails.
* **Delete Account**: Complete security teardown that cleans up user authentication and database document profiles.

### 2. Store User Data in Firestore (Task 2)
* **Sync User Collection**: Creates a matching profile document in the `users` Firestore collection on first sign-up or Google Sign-In containing their `uid`, `name`, `email`, `role`, and `createdAt` timestamp.
* **Duplicate Prevention**: Document writes are tied directly to the `uid`, ensuring no duplicate user profiles.

### 3. Role-Based Protected Routing (Task 3)
* **Admin Dashboard Route** (`/dashboard/admin`): Restricted via `AdminRoute` wrapper checks to users with `role === "admin"`.
* **User Dashboard Route** (`/dashboard/user`): Restricted via `ProtectedRoute` wrapper to authenticated users.
* **Intelligent Redirects**: Unauthorized attempts to access protected routes redirect users to sign-in or home views dynamically.

### 4. Secure CRUD Access Control (Task 4)
* **Authenticated Restriction**: Guest users are barred from performing course creation, editing, or deletion.
* **Ownership Checks**: Course objects in Firestore include a `userId` field. Users are only authorized to Edit/Delete their own courses.
* **Admin Global Rights**: Administrators are authorized to update or delete any course catalog listing.
* **Dynamic UI Updates**: Action controls (Edit/Delete buttons) are hidden from the UI unless the active user holds valid credentials.

### 5. Integrated Chat Application (Task 5)
* **User Directory**: Queries and lists all registered platform users from the Firestore `users` database.
* **Real-time Messaging**: Multi-user private chat window synced in real-time using Firestore `onSnapshot` listeners.
* **Deterministic Rooms**: Uses a compound room ID based on sorted user UIDs (`uid1_uid2`) to keep conversations isolated.
* **Index-Free Performance**: Performs in-memory message sorting to prevent Firestore index errors for smooth testing.

### 6. Dashboard Analytics (Rubric Requirement)
* **Admin Metrics**: Total users, role counts (Admin vs User), total listings count, global valuation, and category breakdown.
* **Normal User Metrics**: Total courses created by user and personal portfolio valuation.
* **Role Toggling**: Admin can promote/demote user roles instantly in the User Directory to facilitate grading evaluation.
* **Data Seeding**: An administrative utility seeds or resets the Firestore courses collection with sample data.

---

## Folder Structure

```text
ARC_Enterprises_web_task/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── courses/        # Course views, stats & calculator
│   │   ├── layouts/        # Navbar & Footer
│   │   ├── pages/          # Auth Pages (Login, Register, Home, About, Contact)
│   │   └── routes/         # ProtectedRoute, AdminRoute
│   ├── context/
│   │   ├── AuthContext     # Handles email/password, google auth, profile sync, password reset & deletes
│   │   ├── CourseContext   # Real-time Firestore sync & seeding
│   │   └── ThemeContext    # Dark & light theme variables
│   ├── firebase/
│   │   └── config.js       # Firebase SDK initialization
│   ├── pages/              # Main pages (Dashboards, Chat, All Courses, Edit, Create, Single)
│   ├── utils/              # Filter helpers and timeout wrappers
│   ├── App.jsx             # Route configurations
│   ├── index.css           # Global typography, colors & glassmorphic styling
│   └── main.jsx            # DOM renderer wrapper
├── package.json            # NPM dependencies & scripts
├── tailwind.config.js      # Utility-first styling variables
└── vercel.json             # Vercel SPA routing rewrites
```

---

## Setup & Running Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Arcofficial4545/ARC_Enterprises_web_task.git
   cd ARC_Enterprises_web_task
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   Ensure the Firebase configuration in `src/firebase/config.js` is active.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Create Admin/User Accounts**:
   Register accounts directly in the UI and select your desired role from the registration dropdown for testing.
