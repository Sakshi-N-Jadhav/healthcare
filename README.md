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
| Security      | bcryptjs, CORS (No JWT) |

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
npm install
create .env file with OPENAI_API_KEY, MONGO_URI
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Future Enhancements

- Voice-based report summaries (Text-to-Speech)
- SMS/email appointment reminders
- Doctor-patient chat feature
- Admin analytics dashboard

---

## 👨‍💻 Developed By

**Sakshi Narayan Jadhav**  
M.S. Software Engineering, Rochester Institute of Technology

- 📧 Email: sj9017@g.rit.edu
- 🔗 LinkedIn: [linkedin.com/in/sakshijadhav28](https://linkedin.com/in/sakshijadhav28)
- 💻 GitHub: [github.com/Sakshi-N-Jadhav](https://github.com/Sakshi-N-Jadhav)

---

> IntelliCare - Empowering patients with AI-driven healthcare clarity.

