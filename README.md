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
