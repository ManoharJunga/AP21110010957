// server.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 9876;
const WINDOW_SIZE = 10;

const COMPANY_NAME = "SRMAP";
const CLIENT_ID = "a94ee1d9-f293-4083-b33e-54e33a013eb3";
const CLIENT_SECRET = "JPnHislKeYuJNCSR";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTU5MjM5LCJpYXQiOjE3MTIxNTg5MzksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImE5NGVlMWQ5LWYyOTMtNDA4My1iMzNlLTU0ZTMzYTAxM2ViMyIsInN1YiI6Im1hbm9oYXJfanVuZ2FAc3JtYXAuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiU1JNQVAiLCJjbGllbnRJRCI6ImE5NGVlMWQ5LWYyOTMtNDA4My1iMzNlLTU0ZTMzYTAxM2ViMyIsImNsaWVudFNlY3JldCI6IkpQbkhpc2xLZVl1Sk5DU1IiLCJvd25lck5hbWUiOiJtYW5vaGFyIiwib3duZXJFbWFpbCI6Im1hbm9oYXJfanVuZ2FAc3JtYXAuZWR1LmluIiwicm9sbE5vIjoiQVAyMTExMDAxMDk1NyJ9.L50BffD3Cloj2bZf4dZjCt1VgxPcv3AVIwMjLcRvss4";

let storedNumbers = [];

// Middleware
app.use(express.json());

// Routes
app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

  if (!isValidNumberId(numberid)) {
    return res.status(400).json({ message: 'Invalid number ID' });
  }

  try {
    const response = await axios.get(`http://testserver/numbers/${numberid}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });
    const receivedNumbers = response.data;

    const prevWindow = [...storedNumbers];
    storedNumbers = mergeUniqueArrays(storedNumbers, receivedNumbers).slice(-WINDOW_SIZE);
    const currentWindow = [...storedNumbers];
    
    const average = calculateAverage(storedNumbers);

    res.json({
      windowPrevState: prevWindow,
      windowCurrState: currentWindow,
      numbers: receivedNumbers,
      avg: average
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper functions
function isValidNumberId(numberid) {
  return ['p', 'f', 'e', 'r'].includes(numberid);
}

function mergeUniqueArrays(arr1, arr2) {
  const merged = [...arr1, ...arr2];
  return [...new Set(merged)];
}

function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
