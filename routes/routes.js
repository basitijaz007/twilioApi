// routes.js
const express = require('express');
const router = express.Router();
const { generateToken, handleCallRouting } = require('./controllers/twilioController');

// Define the routes
router.get('/taskrouter-token', generateToken);
router.post('/call_routing', handleCallRouting);

module.exports = router;
