<!doctype html>

<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Enhanced Device Info Collector</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:0;background:#0b1220;color:#e6eef8;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .container{max-width:1200px;width:100%}
  .card{background:#0f172a;padding:24px;border-radius:12px;box-shadow:0 10px 30px rgba(2,6,23,.6);border:1px solid rgba(255,255,255,.04);margin-bottom:20px}
  h1{margin:0 0 8px;font-size:24px;color:#60a5fa}
  h2{margin:20px 0 12px;font-size:18px;color:#93c5fd;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:8px}
  .sub{margin:0 0 20px;color:#9fb0d6;font-size:14px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
  .panel{background:linear-gradient(180deg,rgba(255,255,255,.03),transparent);padding:16px;border-radius:10px;border:1px solid rgba(255,255,255,.03)}
  .panel.highlight{border-left:4px solid #10b981}
  .k{font-weight:700;color:#9fb0d6;font-size:13px;margin-bottom:6px}
  .v{font-family:ui-monospace,monospace;font-size:13px;color:#dbeafe;word-break:break-all;line-height:1.4}
  .status{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;margin-left:8px}
  .status.success{background:#10b981;color:#000}
  .status.warning{background:#f59e0b;color:#000}
  .status.error{background:#ef4444;color:#fff}
  .status.info{background:#3b82f6;color:#fff}
  .log-container{background:#0f172a;padding:20px;border-radius:12px;border:1px solid rgba(255,255,255,.04)}
  .log-entry{background:rgba(255,255,255,.02);padding:12px;border-radius:8px;margin-bottom:8px;font-size:12px;font-family:ui-monospace,monospace;border-left:4px solid #22c55e}
  .log-entry.warning{border-left-color:#f59e0b}
  .log-entry.error{border-left-color:#ef4444}
  .log-entry.info{border-left-color:#3b82f6}
  .controls{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap}
  .btn{background:#1e40af;color:#fff;padding:10px 16px;border:none;border-radius:8px;cursor:pointer;font-size:14px;transition:background .2s}
  .btn:hover{background:#1d4ed8}
  .btn.secondary{background:#374151}
  .btn.secondary:hover{background:#4b5563}
  .export-area{margin-top:16px}
  .export-box{background:#1f2937;border:1px solid #374151;border-radius:8px;padding:12px;font-family:ui-monospace,monospace;font-size:12px;max-height:200px;overflow-y:auto;white-space:pre-wrap}
  .footer{margin-top:20px;text-align:center;font-size:12px;color:#6b7280}
  .timestamp{color:#9ca3af;font-size:11px}
  .advanced-info{margin-top:16px;padding:12px;background:rgba(59,130,246,.1);border-radius:8px;border:1px solid rgba(59,130,246,.2)}
  .device-id-section{background:linear-gradient(135deg,rgba(16,185,129,.1),rgba(59,130,246,.1));border:1px solid rgba(16,185,129,.3)}
</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>📱 Enhanced Device Info Collector</h1>
      <p class="sub">Comprehensive device information collection with local logging and export capabilities</p>

      <div class="controls">
        <button class="btn" onclick="collectInfo()">🔄 Refresh Data</button>
        <button class="btn secondary" onclick="exportLogs()">💾 Export Logs</button>
        <button class="btn secondary" onclick="clearLogs()">🗑️ Clear Logs</button>
        <button class="btn secondary" onclick="downloadReport()">📊 Download Report</button>
      </div>

      <h2>🔍 Device Identifiers</h2>
      <div class="grid">
        <div class="panel device-id-section">
          <div class="k">Session ID <span class="status info" id="session-status">Generated</span></div>
          <div class="v" id="sessionId">—</div>
        </div>
        <div class="panel device-id-section">
          <div class="k">IMEI / Serial <span class="status warning" id="imei-status">Limited Access</span></div>
          <div class="v" id="deviceSerial">—</div>
        </div>
        <div class="panel device-id-section">
          <div class="k">Hardware Fingerprint <span class="status info" id="fingerprint-status">Generated</span></div>
          <div class="v" id="fingerprint">—</div>
        </div>
        <div class="panel device-id-section">
          <div class="k">MAC Address <span class="status warning" id="mac-status">Restricted</span></div>
          <div class="v" id="macAddress">—</div>
        </div>
      </div>

      <h2>💻 System Information</h2>
      <div class="grid" id="systemGrid">
        <!-- Populated by JavaScript -->
      </div>

      <h2>🌐 Network & Connection</h2>
      <div class="grid" id="networkGrid">
        <!-- Populated by JavaScript -->
      </div>

      <h2>🔧 Hardware Details</h2>
      <div class="grid" id="hardwareGrid">
        <!-- Populated by JavaScript -->
      </div>

      <div class="advanced-info" id="advancedInfo">
        <h3 style="margin:0 0 12px;color:#60a5fa;font-size:16px">🔬 Advanced Detection</h3>
        <div id="advancedDetails">—</div>
      </div>
    </div>

    <div class="log-container">
      <h2>📋 Activity Log</h2>
      <div id="logContainer"></div>
      
      <div class="export-area">
        <h3 style="margin:12px 0 8px;color:#9fb0d6;font-size:14px">Export Data:</h3>
        <div class="export-box" id="exportBox">Click "Export Logs" to generate exportable data...</div>
      </div>
    </div>

    <div class="footer">
      <p>⚠️ <strong>Privacy Notice:</strong> All data is processed locally. No information is transmitted to external servers unless explicitly requested.</p>
      <p>Built with modern web APIs • Enhanced logging capabilities • Local storage only</p>
    </div>
  </div>

<script>
// Global state
let sessionData = {};
let logEntries = [];
let deviceFingerprint = '';

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    message,
    type,
    sessionId: sessionData.sessionId
  };
  logEntries.push(entry);
  
  // Display in UI
  const logContainer = document.getElementById('logContainer');
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.innerHTML = `<span class="timestamp">[${new Date().toLocaleTimeString()}]</span> ${message}`;
  logContainer.appendChild(div);
  logContainer.scrollTop = logContainer.scrollHeight;
  
  // Save to local storage as backup
  try {
    const stored = JSON.parse(localStorage.getItem('deviceInfoLogs') || '[]');
    stored.push(entry);
    localStorage.setItem('deviceInfoLogs', JSON.stringify(stored.slice(-100))); // Keep last 100 entries
  } catch(e) {
    console.warn('Could not save to localStorage:', e);
  }
}

// Utility function to send data to server
async function saveToServer(data) {
  try {
    const response = await fetch('/save-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      log('📡 Data successfully saved to server log', 'success');
    } else {
      log(`❌ Failed to save data to server: ${response.statusText}`, 'error');
    }
  } catch (error) {
    log(`❌ Server save error: ${error.message}`, 'error');
  }
}

function generateFingerprint(data) {
  // Create a device fingerprint from available data
  const components = [
    data.userAgent,
    data.screen,
    data.timezone,
    data.language,
    data.hardwareConcurrency,
    data.deviceMemory,
    data.platform,
    data.canvas,
    data.webgl
  ].filter(x => x && x !== 'unknown' && x !== 'na').join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < components.length; i++) {
    const char = components.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

async function attemptIMEIDetection() {
  const results = [];
  
  try {
    // Method 1: Check if running in app context with device APIs
    if (window.device && window.device.uuid) {
      results.push(`App UUID: ${window.device.uuid}`);
    }
    
    // Method 2: Check for Cordova/PhoneGap device info
    if (window.cordova && window.device) {
      if (window.device.serial) results.push(`Serial: ${window.device.serial}`);
      if (window.device.uuid) results.push(`Device UUID: ${window.device.uuid}`);
    }
    
    // Method 3: WebUSB API (limited)
    if (navigator.usb) {
      try {
        const devices = await navigator.usb.getDevices();
        if (devices.length > 0) {
          results.push(`USB Devices: ${devices.length} connected`);
        }
      } catch(e) {
        results.push('USB API: Permission required');
      }
    }
    
    // Method 4: Check for Android-specific APIs
    if (navigator.userAgent.includes('Android')) {
      // These are typically not accessible from web browsers for privacy reasons
      results.push('Android detected - IMEI access restricted in browser');
    }
    
    // Method 5: Check for iOS device identifiers
    if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
      results.push('iOS detected - Device ID access restricted');
    }
    
    // Method 6: Battery API as device identifier component
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        const batteryHash = `${battery.level}_${battery.chargingTime}_${battery.dischargingTime}`;
        results.push(`Battery signature: ${batteryHash.slice(0, 16)}...`);
      } catch(e) {
        results.push('Battery API: Not accessible');
      }
    }
    
  } catch(error) {
    results.push(`Detection error: ${error.message}`);
  }
  
  return results.length > 0 ? results.join(' • ') : 'No device identifiers accessible (browser security restrictions)';
}

async function attemptMACAddress() {
  try {
    // Method 1: Check for WebRTC local IP (doesn't give MAC but gives network info)
    if (window.RTCPeerConnection) {
      return new Promise((resolve) => {
        const pc = new RTCPeerConnection({iceServers: []});
        const results = [];
        
        pc.createDataChannel('');
        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .catch(() => resolve('WebRTC: Not accessible'));
        
        pc.onicecandidate = (ice) => {
          if (ice.candidate) {
            const candidate = ice.candidate.candidate;
            const match = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
            if (match) {
              results.push(`Local IP: ${match[1]}`);
            }
          }
        };
        
        setTimeout(() => {
          pc.close();
          resolve(results.length > 0 ? results.join(' • ') : 'MAC address not accessible (privacy protection)');
        }, 1000);
      });
    }
    
    return 'MAC address not accessible (browser restrictions)';
  } catch(error) {
    return `MAC detection error: ${error.message}`;
  }
}

async function collectAdvancedInfo() {
  const advanced = [];
  
  try {
    // Media devices
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(d => d.kind === 'videoinput').length;
      const mics = devices.filter(d => d.kind === 'audioinput').length;
      const speakers = devices.filter(d => d.kind === 'audiooutput').length;
      advanced.push(`Media: ${cameras} cameras, ${mics} mics, ${speakers} speakers`);
    }
    
    // Gamepad API
    if (navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      const connected = Array.from(gamepads).filter(g => g !== null).length;
      if (connected > 0) advanced.push(`Gamepads: ${connected} connected`);
    }
    
    // Storage estimates
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const quota = estimate.quota ? (estimate.quota / 1024 / 1024 / 1024).toFixed(2) + ' GB' : 'unknown';
      const usage = estimate.usage ? (estimate.usage / 1024 / 1024).toFixed(2) + ' MB' : 'unknown';
      advanced.push(`Storage: ${usage} used of ${quota} quota`);
    }
    
    // Service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      advanced.push(`Service Workers: ${registrations.length} registered`);
    }
    
  } catch(error) {
    advanced.push(`Advanced detection error: ${error.message}`);
  }
  
  return advanced.join(' • ');
}

function createPanel(key, value, status = null) {
  return `
    <div class="panel">
      <div class="k">${key} ${status ? `<span class="status ${status.type}">${status.text}</span>` : ''}</div>
      <div class="v">${value}</div>
    </div>
  `;
}

async function collectInfo() {
  log('🔄 Starting comprehensive device information collection...', 'info');
  
  try {
    // Generate session ID
    sessionData.sessionId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : ('session_' + Date.now().toString(36) + Math.random().toString(36).slice(2));
    document.getElementById('sessionId').textContent = sessionData.sessionId;
    
    // Basic system info
    sessionData.userAgent = navigator.userAgent || 'unknown';
    sessionData.platform = navigator.platform || 'unknown';
    sessionData.language = (navigator.languages || [navigator.language || 'unknown']).join(', ');
    sessionData.cookieEnabled = navigator.cookieEnabled;
    sessionData.onLine = navigator.onLine;
    sessionData.doNotTrack = navigator.doNotTrack || 'unspecified';
    
    // Enhanced platform info
    if (navigator.userAgentData) {
      const uaData = navigator.userAgentData;
      const brands = (uaData.brands || []).map(b => `${b.brand}/${b.version}`).join(', ');
      sessionData.platformDetails = `Mobile: ${uaData.mobile} • Platform: ${uaData.platform} • Brands: ${brands}`;
    } else {
      sessionData.platformDetails = sessionData.platform;
    }
    
    // Screen and viewport
    const scr = window.screen || {};
    sessionData.screen = `${scr.width || 'na'} × ${scr.height || 'na'}`;
    sessionData.viewport = `${window.innerWidth} × ${window.innerHeight}`;
    sessionData.colorDepth = `${scr.colorDepth || 'na'}-bit`;
    sessionData.pixelRatio = window.devicePixelRatio || 1;
    
    // Hardware info
    sessionData.hardwareConcurrency = navigator.hardwareConcurrency || 'unknown';
    sessionData.deviceMemory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'unknown';
    sessionData.maxTouchPoints = navigator.maxTouchPoints || 0;
    
    // Connection info
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    sessionData.connection = conn ? 
      `${conn.effectiveType || 'unknown'} ${conn.downlink ? '• ' + conn.downlink + ' Mbps' : ''} ${conn.rtt ? '• RTT: ' + conn.rtt + 'ms' : ''}` : 
      'not available';
    
    // Timezone
    sessionData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
    sessionData.timezoneOffset = new Date().getTimezoneOffset();
    
    // Canvas fingerprinting
    sessionData.canvas = await getCanvasFingerprint();
    sessionData.webgl = await getWebGLFingerprint();
    
    // Generate device fingerprint
    deviceFingerprint = generateFingerprint(sessionData);
    document.getElementById('fingerprint').textContent = deviceFingerprint;
    
    // Attempt device identifier collection
    log('🔍 Attempting device identifier detection...', 'info');
    sessionData.deviceSerial = await attemptIMEIDetection();
    document.getElementById('deviceSerial').textContent = sessionData.deviceSerial;
    
    sessionData.macAddress = await attemptMACAddress();
    document.getElementById('macAddress').textContent = sessionData.macAddress;
    
    // Advanced info
    log('🔬 Collecting advanced system information...', 'info');
    sessionData.advanced = await collectAdvancedInfo();
    document.getElementById('advancedDetails').textContent = sessionData.advanced;
    
    // Populate UI grids
    populateGrids();
    
    // Prepare data for server
    const exportData = {
      sessionInfo: sessionData,
      deviceFingerprint: deviceFingerprint,
      logs: logEntries,
      exportTimestamp: new Date().toISOString(),
      summary: {
        totalLogs: logEntries.length,
        sessionDuration: logEntries.length > 0 ? 
          new Date(logEntries[logEntries.length - 1].timestamp).getTime() - new Date(logEntries[0].timestamp).getTime() : 0
      }
    };
    
    // Send data to server
    await saveToServer(exportData);
    
    log('✅ Device information collection completed successfully', 'success');
    
  } catch(error) {
    log(`❌ Error during collection: ${error.message}`, 'error');
    console.error('Collection error:', error);
  }
}

function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Draw complex pattern
    ctx.fillStyle = '#069';
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Device fingerprint canvas 🔍', 8, 24);
    
    // Add shapes and gradients
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(1, '#0000ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(8, 40, 240, 20);
    
    return canvas.toDataURL().slice(-32);
  } catch(e) {
    return 'canvas_not_available';
  }
}

function getWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'webgl_not_available';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    
    return `${vendor} | ${renderer}`;
  } catch(e) {
    return 'webgl_error';
  }
}

function populateGrids() {
  // System grid
  const systemGrid = document.getElementById('systemGrid');
  systemGrid.innerHTML = [
    createPanel('User Agent', sessionData.userAgent),
    createPanel('Platform Details', sessionData.platformDetails),
    createPanel('Languages', sessionData.language),
    createPanel('Timezone', `${sessionData.timezone} (UTC${sessionData.timezoneOffset > 0 ? '-' : '+'}${Math.abs(sessionData.timezoneOffset / 60)}h)`),
    createPanel('Privacy Settings', `DNT: ${sessionData.doNotTrack} • Cookies: ${sessionData.cookieEnabled ? 'enabled' : 'disabled'} • Online: ${sessionData.onLine ? 'yes' : 'no'}`)
  ].join('');
  
  // Network grid
  const networkGrid = document.getElementById('networkGrid');
  networkGrid.innerHTML = [
    createPanel('Connection Type', sessionData.connection),
    createPanel('Network Status', sessionData.onLine ? 'Connected' : 'Offline'),
  ].join('');
  
  // Hardware grid
  const hardwareGrid = document.getElementById('hardwareGrid');
  hardwareGrid.innerHTML = [
    createPanel('Screen Resolution', sessionData.screen),
    createPanel('Viewport Size', sessionData.viewport),
    createPanel('Color Depth', sessionData.colorDepth),
    createPanel('Pixel Ratio', sessionData.pixelRatio.toString()),
    createPanel('CPU Cores', sessionData.hardwareConcurrency.toString()),
    createPanel('Device Memory', sessionData.deviceMemory),
    createPanel('Touch Points', sessionData.maxTouchPoints.toString()),
    createPanel('Canvas Fingerprint', sessionData.canvas),
    createPanel('WebGL Info', sessionData.webgl)
  ].join('');
}

function exportLogs() {
  const exportData = {
    sessionInfo: sessionData,
    deviceFingerprint: deviceFingerprint,
    logs: logEntries,
    exportTimestamp: new Date().toISOString(),
    summary: {
      totalLogs: logEntries.length,
      sessionDuration: logEntries.length > 0 ? 
        new Date(logEntries[logEntries.length - 1].timestamp).getTime() - new Date(logEntries[0].timestamp).getTime() : 0
    }
  };
  
  const exportBox = document.getElementById('exportBox');
  exportBox.textContent = JSON.stringify(exportData, null, 2);
  log('📤 Data exported to display area', 'info');
}

function clearLogs() {
  if (confirm('Are you sure you want to clear all logs?')) {
    logEntries = [];
    document.getElementById('logContainer').innerHTML = '';
    document.getElementById('exportBox').textContent = 'Logs cleared. Click "Export Logs" to generate new data...';
    localStorage.removeItem('deviceInfoLogs');
    log('🗑️ All logs cleared', 'info');
  }
}

function downloadReport() {
  exportLogs();
  const exportData = document.getElementById('exportBox').textContent;
  const blob = new Blob([exportData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `device-info-report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  log('💾 Report downloaded as JSON file', 'success');
}

// Load any stored logs on page load
function loadStoredLogs() {
  try {
    const stored = JSON.parse(localStorage.getItem('deviceInfoLogs') || '[]');
    logEntries = stored;
    stored.forEach(entry => {
      const logContainer = document.getElementById('logContainer');
      const div = document.createElement('div');
      div.className = `log-entry ${entry.type}`;
      div.innerHTML = `<span class="timestamp">[${new Date(entry.timestamp).toLocaleTimeString()}]</span> ${entry.message}`;
      logContainer.appendChild(div);
    });
  } catch(e) {
    console.warn('Could not load stored logs:', e);
  }
}

// Auto-run on page load
document.addEventListener('DOMContentLoaded', function() {
  loadStoredLogs();
  collectInfo();
});
</script>

</body>
</html>
