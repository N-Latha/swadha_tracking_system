import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the React app can talk to this server
app.use(cors());
app.use(express.json());

// Setup Google Sheets Authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Fix newlines in key
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// ==========================================
// TEST ENDPOINT
// ==========================================
app.get('/api/test', async (req, res) => {
  try {
    // Attempt to read the spreadsheet title to verify connection
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    res.json({ message: 'Connection successful!', title: response.data.properties.title });
  } catch (error) {
    console.error('Error connecting to Google Sheets:', error);
    res.status(500).json({ error: 'Failed to connect to Google Sheets', details: error.message });
  }
});

// ==========================================
// SESSIONS ENDPOINTS
// ==========================================

// Get all active sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sessions!A2:H', // Assuming Row 1 is headers
    });
    
    const rows = response.data.values || [];
    
    // Map array rows back to objects
    const sessions = rows.map(row => ({
      id: row[0],
      studentId: row[1],
      machineId: row[2],
      purpose: row[3],
      startTime: row[4],
      exitTime: row[5] || undefined,
      duration: row[6] ? parseInt(row[6]) : undefined,
      status: row[7],
    }));

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Start a new session
app.post('/api/sessions', async (req, res) => {
  const { id, studentId, machineId, purpose, startTime, status } = req.body;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sessions!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[id, studentId, machineId, purpose, startTime, '', '', status]],
      },
    });
    res.status(201).json({ message: 'Session started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend proxy server running on http://localhost:${PORT}`);
  console.log(`Waiting for Google credentials in .env...`);
});
