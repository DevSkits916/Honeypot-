# Visitor Logger

A minimal Express application that records the IP address, detected device type, and user agent string for everyone who loads the root page. Visit records are appended to `logs/visitors.log` in a tab-separated format.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000` in your browser. Each visit will be appended to `logs/visitors.log`.

## Deployment Notes

The app respects the `PORT` environment variable, so you can deploy it to any free hosting platform that supports Node.js (for example, Render, Fly.io, or Railway). Make sure the platform allows writing to disk if you need to persist the `logs` directory.
