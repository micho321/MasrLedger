# [MasrLedger]

**Course:** Electronic Business Development (BINF 503)  
**Semester:** Winter 2025  
**Instructor:** Dr. Nourhan Hamdi  
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa

---

## 1. Team Members

_List all team members (5-6 students) below._

| Name             | Student ID | Tutorial Group | GitHub Username         |
| :--------------- | :--------- | :------------- | :--------------         |
|  Michel Nabil    | 13007593   | [T7]           | [@micho321]             |
|  Youssef Ismail  | 13007155   | [T7]           | [@youssefismail321]     |
|  Ahmed Mazen     | 13007348   | [T7]           | [@ahmedmazen16]         | 
|  Marawan Mohamed | 13005980   | [T5]           | [@marwan2oo5]           |
|  Yousof Hariry   | 13007173   | [T5]           | [@yousofelhariry528-ai] |
|  Eslam Yasser    | 13005335   | [T5]           | [@eslamy309-stack]      |

---

## 2. Project Description

- Project Description:

MasrLedger is a web-based financial management platform designed for Egyptian freelancers and micro-business owners who struggle to keep track of their financial activity.

The platform allows users to organize their income and expenses, monitor their financial history, view simple monthly performance summaries, and request accountant support when needed.

The main goal of the project is to help independent workers gain clarity, structure, and control over their finances without requiring accounting knowledge.

- Concept:

MasrLedger is a web-based platform that helps Egyptian freelancers and micro-business owners organize their financial activity in one place. The app lets users record income and expenses, view their transaction history, see simple monthly summaries, and request accountant support.

The purpose of the platform is to make financial organization easier, clearer, and more accessible for people working independently in Egypt.

- Link to Fin-Tech Course Document:

https://drive.google.com/drive/folders/1Tz7-0l-GwcKXC3Lyw4STqpUiPtwdUbgy?usp=drive_link

---

## 3. Feature Breakdown

### 3.1 Full Scope

_List ALL potential features/user stories envisioned for the complete product (beyond just this course)._

-User registration & login

-Password recovery/reset

-User profile management

-Record income & expenses

-Edit/update/delete transactions

-Categorize transactions

-View complete transaction history

-Filter transactions by date/type/category

-Monthly financial summary dashboard

-Automatic estimated tax display

-Accountant consultation requests

-Accountant reply/approval system

-Multi-role users (user / accountant / admin)

-Notifications / reminders

-Exportable monthly reports (PDF/CSV)

-Multiple business profiles per user

-Subscription-based premium features

-System analytics for admin

-In-app chat with accountant (future)

-Mobile-responsive interface

-Full document upload support (future)

-Graphical financial charts (future)

-Automated invoice detection (future)


### 3.2 Selected MVP Use Cases (Course Scope)

_From the list above, identify the **5 or 6 specific use cases** you will implement for this course. Note: User Authentication is mandatory._

1-User Authentication
2-Record Financial Transactions (CRUD)
3-View Transaction History + Filters
4-Monthly Summary + Simple Tax Estimate
5-Accountant Consultation Requests
6-User Profile Management

---

## 4. Feature Assignments (Accountability)

_Assign one distinct use case from Section 3.2 to each team member. This member is responsible for the full-stack implementation of this feature._
 
| Team Member       | Assigned Use Case                       | Brief Description of Responsibility                          |
| :---------------- | :-------------------------------------- | :----------------------------------------------------------- |
| Michel Nabil      | User Authentication                     | Register, Login, JWT handling, Password Hashing.             |
| Marwan Mohamed    | Transaction CRUD                        | Create, edit, and delete transaction records.                |
| Ahmed Mazen       | Transaction History & Filters           | View transaction history and apply filters.                  |
| Youssef Ismail    | Monthly Summary & Tax Estimate          | Calculate monthly totals and simple tax estimate.            |
| Yousof Khaled   | Accountant Consultation Requests        | Create and track accountant consultation requests.           |
| Eslam Yasser      | User Profile Management                 | Update profile info and business type.                       |

---

## 5. Data Model (Initial Schemas)

_Define the initial Mongoose Schemas for your application’s main data models (User, Transaction, Account, etc.). You may use code blocks or pseudo-code._

### User Schema

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  businessType: {
    type: String, // e.g. "freelancer" or "micro-business"
  },
  role: {
    type: String, // e.g. "user", "admin", "accountant"
  },
});

module.exports = mongoose.model('User', UserSchema);

```

### Transaction Schema

```javascript
const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String, // "income" or "expense"
    required: true,
  },
  category: {
    type: String, // e.g. "rent", "utilities", "project income"
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);

```

### AccountantRequest Schema

```javascript
const AccountantRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  preferredDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String, // "pending", "accepted", "completed"
    required: true,
  },
});

module.exports = mongoose.model('AccountantRequest', AccountantRequestSchema);

```

---

## 6. Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Postman (for API testing)

### Installation Steps

1. **Clone the repository** (or navigate to project directory)
   ```bash
   cd BINF
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update `.env` with your MongoDB Atlas connection string and JWT secret

4. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

5. **Verify server is running**
   - Open browser and navigate to `http://localhost:5000`
   - You should see the welcome message with API endpoints

---

## 7. API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |

### User Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | Yes |
| PUT | `/users/profile` | Update user profile | Yes |

### Transaction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/transactions` | Create transaction | Yes |
| GET | `/transactions` | Get all transactions (with filters) | Yes |
| GET | `/transactions/:id` | Get transaction by ID | Yes |
| PUT | `/transactions/:id` | Update transaction | Yes |
| DELETE | `/transactions/:id` | Delete transaction | Yes |

**Query Parameters for GET /transactions:**
- `type` - Filter by income/expense
- `category` - Filter by category
- `startDate` - Filter by start date (YYYY-MM-DD)
- `endDate` - Filter by end date (YYYY-MM-DD)

### Summary Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/summary/monthly` | Get monthly summary | Yes |
| GET | `/summary/tax` | Get tax estimate | Yes |

**Query Parameters:**
- `month` - Month number (1-12)
- `year` - Year (e.g., 2025)

### Accountant Request Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/accountant/requests` | Create consultation request | Yes |
| GET | `/accountant/requests` | Get user's requests | Yes |
| GET | `/accountant/requests/:id` | Get request by ID | Yes |
| PUT | `/accountant/requests/:id` | Update request status | Yes |
| GET | `/accountant/requests/all` | Get all requests (accountant/admin) | Yes (accountant/admin) |

---

## 8. Testing with Postman

### Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Select the file: `postman/MasrLedger_API.postman_collection.json`
4. The collection will be imported with all endpoints

### Testing Workflow

1. **Register a new user**
   - Use the "Register User" request
   - The token will be automatically saved

2. **Login** (if needed)
   - Use the "Login User" request
   - Token will be updated

3. **Test protected endpoints**
   - All other requests use the saved token automatically
   - Create transactions, view summaries, etc.

### Collection Variables

The collection uses these variables (auto-populated):
- `baseUrl` - API base URL
- `token` - JWT authentication token
- `userId` - Current user ID
- `transactionId` - Last created transaction ID
- `requestId` - Last created request ID

---

## 9. Project Structure

```
BINF/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User profile logic
│   ├── transactionController.js  # Transaction CRUD
│   ├── summaryController.js # Monthly summary & tax
│   └── accountantController.js   # Consultation requests
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User schema
│   ├── Transaction.js       # Transaction schema
│   └── AccountantRequest.js # Accountant request schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── users.js             # User routes
│   ├── transactions.js      # Transaction routes
│   ├── summary.js           # Summary routes
│   └── accountant.js        # Accountant routes
├── postman/
│   └── MasrLedger_API.postman_collection.json
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Main application entry
└── README.md
```

---

## 10. Milestone 1 Completion Checklist

- [x] Backend Setup: Express server created
- [x] Database Connection: MongoDB Atlas integration
- [x] Mongoose Models: User, Transaction, AccountantRequest
- [x] API Endpoints: All 6 use cases implemented
- [x] CRUD Operations: Full CRUD for User and Transaction
- [x] Authentication: JWT-based auth with bcrypt
- [x] Testing: Postman collection created
- [x] Documentation: API endpoints documented

---
