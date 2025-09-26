Enhanced Device Info Collector

A single-page web app that gathers non-sensitive device, browser, and network characteristics in the client, shows them in a sleek dashboard, logs activity locally, and lets you export or download a JSON report. Optionally, it can POST a full session snapshot to a server endpoint you control.

Privacy by default: All processing is local. Nothing is sent anywhere unless you wire up the optional /save-log endpoint described below.

⸻

Highlights
	•	One file, zero build: Pure HTML/CSS/JS. Open index.html in a browser or serve it statically.
	•	Rich UI: Cards for identifiers, system, network, and hardware details. Live activity log.
	•	Session fingerprint: Deterministic hash from user agent, screen, locale, canvas, and WebGL signatures.
	•	Local persistence: Recent log events buffered in localStorage (last 100 entries).
	•	Exports:
	•	“Export Logs” renders a JSON block in-page for copy/paste.
	•	“Download Report” saves a timestamped .json file.
	•	Optional server save: One POST to /save-log with the whole snapshot if you add a tiny backend.

⸻

What it collects (browser-accessible only)
	•	Identifiers: Random session ID, canvas fingerprint, WebGL renderer/vendor.
	•	System: User agent, platform details, languages, timezone and offset, DNT/cookie/online flags.
	•	Display: Screen resolution, viewport size, color depth, pixel ratio.
	•	Hardware hints: Logical CPU cores, reported device memory, max touch points.
	•	Network hints: Effective connection type, downlink, RTT when available.
	•	Advanced: Counts of media devices, storage quota/usage estimate, registered service workers, connected gamepads.
	•	Best-effort notes: IMEI/serial and MAC are not available to web pages; the app explains these limitations and provides WebRTC local IP hints where possible.

Browsers deliberately block access to IMEI, serial numbers, and MAC addresses. The app surfaces capability limits instead of pretending otherwise.

⸻

Quick start
	1.	Save your code as index.html.
	2.	Double-click to open in a modern browser, or serve it:

# any static server works; here are a few options
python3 -m http.server 8000
# or
npx serve .
# or
deno run --allow-net --allow-read https://deno.land/std@0.224.0/http/file_server.ts


	3.	The page auto-collects on load. Use the top buttons to refresh, export, clear, or download a report.

⸻

Optional: enable server logging

The UI includes a saveToServer() function that POSTs JSON to /save-log. To activate it, stand up a minimal endpoint and host the page under the same origin (or configure CORS).

Node.js (Express)

// server.js
import express from "express";
const app = express();
app.use(express.json({ limit: "1mb" }));

app.post("/save-log", (req, res) => {
  // TODO: persist req.body to a database or file
  console.log("received device snapshot", {
    sessionId: req.body?.sessionInfo?.sessionId,
    when: req.body?.exportTimestamp,
  });
  res.status(200).json({ ok: true });
});

app.use(express.static(".")); // serves index.html from project root
app.listen(3000, () => console.log("http://localhost:3000"));

npm init -y
npm i express
node server.js

Python (Flask)

# app.py
from flask import Flask, request, jsonify, send_from_directory
app = Flask(__name__, static_url_path="", static_folder=".")

@app.post("/save-log")
def save_log():
    data = request.get_json(silent=True)
    # TODO: persist `data`
    print("received device snapshot",
          data.get("sessionInfo", {}).get("sessionId"))
    return jsonify(ok=True), 200

@app.get("/")
def root():
    return send_from_directory(".", "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)

pip install flask
python app.py

If you host the HTML and server on different origins, set CORS headers on /save-log.

⸻

File structure

/your-project
└── index.html        # the file you pasted in your issue

No build tooling. No dependencies. Ship it as is.

⸻

How it works
	•	Session ID: crypto.randomUUID() if available, else a timestamp/random fallback.
	•	Fingerprint: Simple 32-bit hash based on a concatenation of stable features:
userAgent | screen | timezone | language | cores | memory | platform | canvas | webgl.
	•	Canvas/WebGL: Renders a tiny canvas with text and gradient; reads data URL tail. Queries WebGL vendor/renderer with WEBGL_debug_renderer_info when supported.
	•	Network: Uses navigator.connection for effective type/downlink/RTT when present.
	•	Advanced inventory: mediaDevices.enumerateDevices, navigator.storage.estimate, service workers, gamepads.
	•	Local log buffer: Appends structured entries to logEntries and mirrors them to localStorage.

⸻

Buttons and behaviors
	•	Refresh Data: Re-runs collection, updates all panels, and attempts a server save.
	•	Export Logs: Renders a full JSON export in the “Export Data” box.
	•	Clear Logs: Empties on-page log, clears localStorage buffer.
	•	Download Report: Triggers a .json file download of the latest export.

⸻

Configuration tips
	•	Disable server calls: Comment out or no-op the await saveToServer(exportData) line in collectInfo().
	•	Retention: Change the slice(-100) window in localStorage to keep more or fewer entries.
	•	Styling: All styles are inlined for portability; move them to a CSS file if you prefer cacheability.

⸻

Browser support
	•	Modern Chromium, Firefox, and Safari. Feature availability varies:
	•	navigator.connection, userAgentData, getBattery, and WEBGL_debug_renderer_info are not universal.
	•	The app annotates unavailable features with clear “restricted/not available” statuses.

⸻

Security, privacy, and consent
	•	Be transparent. If you enable server logging, disclose clearly and obtain consent where required.
	•	Store responsibly. Snapshots may include user agent, IP-adjacent hints, and device traits. Treat them as potentially identifying.
	•	Don’t overreach. Browsers intentionally block IMEI/serial/MAC. This tool does not and cannot bypass platform protections.
	•	CORS/CSRF. If exposing /save-log, consider auth, CSRF tokens, and rate limits on your backend.

The footer in the UI already states: “All data is processed locally. No information is transmitted to external servers unless explicitly requested.”

⸻

Troubleshooting
	•	No server logs appear: You haven’t implemented /save-log or the request is blocked by CORS. Open DevTools → Network.
	•	Blank WebGL info: The GPU info extension isn’t supported. This is normal.
	•	No connection metrics: navigator.connection isn’t implemented in your browser.
	•	Local logs missing on reload: Check if your browser is in private mode or localStorage is disabled.

⸻

Sample export structure

{
  "sessionInfo": { "...": "..." },
  "deviceFingerprint": "abcdef12",
  "logs": [{ "timestamp": "...", "message": "...", "type": "info" }],
  "exportTimestamp": "2025-09-26T02:59:00.000Z",
  "summary": { "totalLogs": 23, "sessionDuration": 4213 }
}


⸻

Roadmap ideas
	•	CSV export alongside JSON
	•	Optional encryption of exports with a passphrase
	•	Toggleable modules (e.g., skip canvas/WebGL)
	•	Pluggable transports (WebSocket, fetch-retry queue, Beacon API)
	•	Structured schema with versioning

⸻

License

MIT. See LICENSE in this repo. If you need a different license, set it before distributing.

⸻

Acknowledgements

Built with modern browser APIs and a healthy respect for user privacy.
