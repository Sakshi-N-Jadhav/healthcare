// routes/mediGenie.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { OpenAI } = require('openai');
require("dotenv").config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const upload = multer({ dest: 'uploads/' });
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Utilities
async function extractTextFromImage(imagePath) {
  const result = await Tesseract.recognize(imagePath, 'eng');
  return result.data.text.trim();
}

async function extractTextFromPDF(pdfPath) {
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(buffer);
  return data.text.trim();
}

async function analyzeHealthReport(text) {
  const prompt = `
  The following is a medical test report:
  ${text}

  You have been a medical nurse for more than 10 years and have been serving in the medical sector helping people understand their medical report in a 
  clear and a concise language. You will be given a medical report to analyze and summarize. Your task is to read the entire report find the most important 
  information as well as explain the report to me like explaining to a 10 year old child. also mention some details about the user at the start. Make sure to explain everything
  in bullet points. Also, suggest foods or lifestyle changes the patient should adopt to improve their health.
  After every meaningful sentence write GOINGTONEXT word to differentiate next point.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a medical assistant that simplifies health reports for normal people.' },
      { role: 'user', content: prompt }
    ]
  });

  return response.choices[0].message.content.trim();
}

// Routes

// 1. Health check route (optional if already in server.js)
router.get("/", (req, res) => {
  res.json({ message: "mediGenie API is running!" });
});

// 2. GPT test route
router.get("/try", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'What is the capital of Japan?' }
      ],
      max_tokens: 50
    });

    const answer = response.choices[0].message.content.trim();
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. File upload + GPT analysis route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const filename = req.file.originalname;
    let extractedText;

    if (filename.endsWith(".pdf")) {
      extractedText = await extractTextFromPDF(filePath);
    } else {
      extractedText = await extractTextFromImage(filePath);
    }

    const analysis = await analyzeHealthReport(extractedText);
    const analysisList = analysis.split("GOINGTONEXT").map(s => s.trim()).filter(Boolean);

    res.json({ analysis_report: analysisList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 

router.post("/translate", async (req, res) => {
  try {
    const { translate_to, analysis_report } = req.body;
    if (!translate_to || !analysis_report) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // if (!Array.isArray(analysis_report)) {
    //   return res.status(400).json({ error: "'analysis_report' must be a list" });
    // }

    const joinedReport = analysis_report.join('\n');
    const prompt = `
    Translate the following medical report into ${translate_to}:

    ${joinedReport}

    Ensure the translation is accurate and maintains the medical terminology. Keep the format intact.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional medical translator.' },
        { role: 'user', content: prompt }
      ]
    });

    const translatedText = response.choices[0].message.content.trim().split('\n');
    res.json({ translated_report: translatedText });

  } catch (error) {
    console.error("Translation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 

module.exports = router;
