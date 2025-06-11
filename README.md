# LeadManager

A full-featured Lead and Task Management System designed for sales teams, with dynamic user roles, proposal workflows, stage-wise lead progression, reminders, and reporting.

Built using:

- **Frontend**: React (Vite), Bootstrap
- **Backend**: Spring Boot
- **Database**: PostgreSQL
- **Deployment**: Vercel (Frontend) + Render (Backend)

---

## 🔥 Features

### 🛠 Admin Capabilities

- ✅ Invite users via email — token-based invite system with secure registration
- ✅ Enable/Disable users from accessing the platform (data retained)
- ✅ Update user roles (e.g., assign "Proposal Creator" responsibility)
- ✅ Create leads manually or via bulk upload (Excel/CSV)
- ✅ Assign leads randomly to available users (salespeople)
- ✅ Manage users' passwords (change/reset)
- ✅ View & download reports in Excel / PDF
- ✅ Filterable reports displayed in **tables**

---

### 👥 User Workflow (Sales Team)

- ✅ View assigned leads
- ✅ Progress leads through stages:
  - `New → Contacted → Follow-up → Proposal Sent → Closed`
- ✅ Categorize leads as **Hot**, **Warm**, or **Cold**
- ✅ Add required data before progressing between stages
- ✅ Set **follow-up** for leads (will receive a **reminder notification** 2 hours before)
- ✅ Upload documents & update notes per stage
- ✅ Request a proposal if the client asks for one

---

### 📄 Proposal Creation Flow

- Any user can request a proposal for a lead
- Proposal Creators receive a task notification when assigned
- They upload a proposal file
- Requesting user marks it as complete → status changes to complete

---

## 📦 Technologies Used

| Layer       | Tech                                  |
|-------------|----------------------------------------|
| Frontend    | React (Vite), Bootstrap                |
| Backend     | Spring Boot                            |
| Database    | PostgreSQL                             |
| Auth        | JWT-based authentication               |
| Deployment  | Vercel (Frontend), Render (Backend)    |
| File Upload | Multipart form upload                  |
| Excel/CSV   | Apache POI, OpenCSV                    |

---

## 📁 Setup (Local)

### Backend
```bash
cd backend
./mvnw spring-boot:run
