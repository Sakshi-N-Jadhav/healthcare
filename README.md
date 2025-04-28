# IntelliCare: A Full-Stack AI-Enabled Healthcare Portal

---

## 📅 Overview

**IntelliCare** is a web-based healthcare portal that enables patients to book appointments, upload and interpret medical reports using AI, manage health notes, and interact with doctors securely. It integrates OCR, PDF parsing, and OpenAI GPT-4o for report summarization and multilingual translation.

---

## 📊 Features

- Secure patient and doctor login
- Medical report upload (PDF/Image/Text)
- OCR and AI-powered summarization
- Multilingual report translation (Hindi, Marathi, Spanish, etc.)
- Appointment scheduling and management
- Health notes and profile management
- Export reports as PDF or Excel
- Responsive web interface

---

## 💪 Tech Stack

| Layer         | Technologies |
|---------------|--------------|
| Frontend      | React, Vite, Material UI, Axios |
| Backend       | Node.js, Express, Multer |
| Database      | MongoDB with Mongoose |
| AI & OCR      | Tesseract.js, pdf-parse, OpenAI GPT-4o |
| Utilities     | html2canvas, jsPDF, xlsx, Chart.js |
| Security      | bcryptjs, CORS |

---

## 💡 Why This Stack

React with Vite provides fast, modular frontend development while Node.js and Express offer scalable API handling. MongoDB efficiently stores healthcare data structures. Tesseract.js and pdf-parse handle medical report extraction, and GPT-4o enables AI-based report summarization and translation.

---

## ⚖️ System Architecture

- **Frontend** (React + Material UI)
  - User authentication
  - File upload interface
  - View AI-generated summaries
  - Appointment and profile management

- **Backend** (Node.js + Express)
  - API endpoints for users, appointments, report processing, translation
  - File upload handling with Multer
  - AI text processing via GPT-4o and OCR modules
  - Data persistence with MongoDB

- **AI/OCR Services**
  - Tesseract.js for image OCR
  - pdf-parse for PDF text extraction
  - GPT-4o for medical report summarization and translation

---

## 🔄 Workflow

1. User registers or logs in.
2. Patient uploads a medical report.
3. Backend processes file (OCR/pdf-parse).
4. Text passed to GPT-4o for summarization.
5. Summary returned and displayed.
6. User optionally translates report.
7. Data stored in MongoDB.
8. Patients can book appointments and manage notes.

---

## 🔧 Setup Instructions

### Backend
```bash
cd backend
create .env file with OPENAI_API_KEY, MONGO_URI
To start the backend server:
node server.js 
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
---

## 📷 Output Screenshots

- Home Page
![Screenshot 2025-04-23 091513](https://github.com/user-attachments/assets/473a9cfd-7e6f-4a81-8faf-d878d95d6375)

- Login and SignUp Page
![Screenshot 2025-04-23 091945](https://github.com/user-attachments/assets/0287c2b9-d13b-44e6-967f-c423304e1404)

- Doctor Directory Page
![Screenshot 2025-04-23 092328](https://github.com/user-attachments/assets/8ff60cb4-b657-4063-b364-7e6a1586f8d5)

- Book Appointment Page
![Screenshot 2025-04-23 092040](https://github.com/user-attachments/assets/a31087d2-5295-4cc3-96c4-c6e91dc6fbb4)

- Patient Dashboard Overview
![Screenshot 2025-04-23 092132](https://github.com/user-attachments/assets/28182d54-3cea-41e5-89d3-cb718688aff5)

- Upcoming Appointments List
![Screenshot 2025-04-23 092212](https://github.com/user-attachments/assets/7ea6adc3-fafc-46f7-90db-2dbf364084d7)

- Rescheduling Appointments
![Screenshot 2025-04-23 092301](https://github.com/user-attachments/assets/6b3afa16-7d5c-4a96-a469-d2526c28dd75)

- Upload Medical Report Interface
![Screenshot 2025-04-23 092409](https://github.com/user-attachments/assets/50946aff-f22b-453c-8c21-cd8c9f55a8d3)

- Medical Report + AI Summary (English)
![Screenshot 2025-04-23 092841](https://github.com/user-attachments/assets/a61ea9e4-5d24-4e16-a7a7-74c3b4790584)

- Medical Report + AI Summary (Translated to Spanish)
![Screenshot 2025-04-23 093852](https://github.com/user-attachments/assets/738ac01a-c4c4-4cc1-9420-9d132e08a892)


---

## 📈 Future Enhancements

- Voice-based report summaries (Text-to-Speech)
- SMS/email appointment reminders
- Doctor-patient chat feature
- Admin analytics dashboard

---

> IntelliCare - Empowering patients with AI-driven healthcare clarity.

