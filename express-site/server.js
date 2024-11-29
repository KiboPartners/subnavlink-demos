// Import the Express module
const express = require('express');
const path = require('path');

// Create an Express application
const app = express();

// Middleware to parse JSON body in POST requests
app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Handle GET requests to '/'
app.get('/', (req, res) => {
  res.send('<!DOCTYPE html><html><head><title>Hello World</title></head><body><h1>Hello, World!</h1></body></html>');
});

// Handle POST requests to '/'
app.post('/', (req, res) => {
  // Here, you can access the data sent in the POST request via `req.body`
  console.log(req.query)
  console.log('POST data:', req.body);  // This will log the JSON or form data sent with the request

  // Send the same HTML response as the GET request
  res.send('<!DOCTYPE html><html><head><title>Hello World</title></head><body><h1>Hello, World!</h1></body></html>');
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

