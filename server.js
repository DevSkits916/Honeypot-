const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const logDir = path.join(__dirname, 'logs');
const logFile = path.join(logDir, 'visitors.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

app.set('trust proxy', true);

function detectDeviceType(userAgent = '') {
  const ua = userAgent.toLowerCase();

  if (/tablet|ipad|playbook|silk/.test(ua)) {
    return 'tablet';
  }

  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
}

function logVisit(data) {
  const line = `${new Date().toISOString()}\t${data.ip}\t${data.deviceType}\t${data.userAgent}\n`;
  fs.appendFile(logFile, line, (err) => {
    if (err) {
      console.error('Failed to log visit:', err);
    }
  });
}

app.get('/', (req, res) => {
  const userAgent = req.get('user-agent') || 'unknown';
  const forwardedFor = req.get('x-forwarded-for');
  const ip = (forwardedFor && forwardedFor.split(',')[0].trim()) || req.ip || req.socket.remoteAddress || 'unknown';
  const deviceType = detectDeviceType(userAgent);

  logVisit({ ip, userAgent, deviceType });

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Visitor logger listening on port ${port}`);
});
