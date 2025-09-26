const STORAGE_KEY = 'visitor-insights:entries';
const MAX_LOG_ENTRIES = 200;
const DEVICE_ID_KEY = 'visitor-insights:device-id';

const selectors = {
  ip: document.querySelector('[data-current-ip]'),
  location: document.querySelector('[data-current-location]'),
  organization: document.querySelector('[data-current-organization]'),
  deviceId: document.querySelector('[data-current-deviceid]'),
  device: document.querySelector('[data-current-device]'),
  platform: document.querySelector('[data-current-platform]'),
  language: document.querySelector('[data-current-language]'),
  timezone: document.querySelector('[data-current-timezone]'),
  screen: document.querySelector('[data-current-screen]'),
  referrer: document.querySelector('[data-current-referrer]'),
  userAgent: document.querySelector('[data-current-useragent]'),
  emptyMessage: document.getElementById('emptyMessage'),
  tableBody: document.getElementById('logTableBody'),
  downloadButton: document.getElementById('downloadLogs'),
};

function getOrCreateDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (id) {
      return id;
    }

    if (crypto?.randomUUID) {
      id = crypto.randomUUID();
    } else {
      const random = Math.random().toString(36).slice(2);
      const timestamp = Date.now().toString(36);
      id = `${timestamp}-${random}`;
    }

    localStorage.setItem(DEVICE_ID_KEY, id);
    return id;
  } catch (error) {
    console.warn('Unable to access localStorage for device id:', error);
    return 'Unavailable';
  }
}

function detectDeviceType(ua) {
  const agent = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk|kindle/.test(agent)) return 'Tablet';
  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/.test(agent)) return 'Mobile';
  return 'Desktop';
}

function getStoredEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn('Failed to parse stored visitor data:', error);
    return [];
  }
}

function persistEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_LOG_ENTRIES)));
  } catch (error) {
    console.warn('Unable to persist visitor data:', error);
  }
}

function formatLocation(entry) {
  const parts = [entry.city, entry.region, entry.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Unavailable';
}

function updateActionStates(entries) {
  const hasEntries = entries.length > 0;
  if (selectors.downloadButton) {
    selectors.downloadButton.disabled = !hasEntries;
    selectors.downloadButton.setAttribute('aria-disabled', String(!hasEntries));
  }
}

function updateCurrentVisit(entry) {
  selectors.ip.textContent = entry.ip || 'Unavailable';
  selectors.location.textContent = formatLocation(entry);
  selectors.organization.textContent = entry.organization || 'Unavailable';
  if (selectors.deviceId) {
    selectors.deviceId.textContent = entry.deviceId || 'Unavailable';
  }
  selectors.device.textContent = `${entry.deviceType}${entry.screenOrientation ? ` (${entry.screenOrientation})` : ''}`;
  selectors.platform.textContent = entry.platform || 'Unavailable';
  selectors.language.textContent = entry.language || 'Unavailable';
  selectors.timezone.textContent = entry.timezone || 'Unavailable';
  selectors.screen.textContent = entry.screen || 'Unavailable';
  selectors.referrer.textContent = entry.referrer || 'Direct';
  selectors.userAgent.textContent = entry.userAgent || 'Unavailable';
}

function renderLogEntries(entries) {
  const hasEntries = entries.length > 0;
  selectors.emptyMessage.hidden = hasEntries;
  selectors.tableBody.innerHTML = '';

  if (!hasEntries) {
    updateActionStates(entries);
    return;
  }

  const fragment = document.createDocumentFragment();

  entries.forEach((entry) => {
    const row = document.createElement('tr');

    const cells = [
      new Date(entry.timestamp).toLocaleString(),
      entry.ip || 'Unavailable',
      formatLocation(entry),
      entry.deviceId || 'Unavailable',
      `${entry.deviceType}${entry.platform ? ` · ${entry.platform}` : ''}`,
      entry.referrer || 'Direct',
    ];

    cells.forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });

    fragment.appendChild(row);
  });

  selectors.tableBody.appendChild(fragment);
  updateActionStates(entries);
}

async function resolveGeolocation() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      latitude: data.latitude,
      longitude: data.longitude,
      postal: data.postal,
      organization: data.org,
    };
  } catch (error) {
    console.warn('Unable to fetch geolocation details:', error);
    return {};
  } finally {
    clearTimeout(timeout);
  }
}

function buildBaseEntry() {
  const ua = navigator.userAgent || 'Unavailable';
  return {
    timestamp: new Date().toISOString(),
    deviceId: getOrCreateDeviceId(),
    userAgent: ua,
    deviceType: detectDeviceType(ua),
    platform: navigator.userAgentData?.platform || navigator.platform || 'Unavailable',
    language: navigator.language || (navigator.languages && navigator.languages[0]) || 'Unavailable',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unavailable',
    screen: `${window.screen.width}×${window.screen.height}`,
    screenOrientation:
      window.screen.orientation?.type || window.screen.mozOrientation || window.screen.msOrientation || '',
    referrer: document.referrer || 'Direct',
    page: window.location.href,
  };
}

function downloadCsv(entries) {
  if (!entries.length) {
    return;
  }

  const headers = [
    'timestamp',
    'ip',
    'city',
    'region',
    'country',
    'latitude',
    'longitude',
    'postal',
    'organization',
    'deviceId',
    'deviceType',
    'platform',
    'language',
    'timezone',
    'screen',
    'screenOrientation',
    'referrer',
    'page',
    'userAgent',
  ];

  const escape = (value) => {
    if (value === undefined || value === null) return '';
    const stringValue = String(value).replace(/"/g, '""');
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue}"`;
    }
    return stringValue;
  };

  const lines = [headers.join(',')];

  entries.forEach((entry) => {
    const row = headers.map((key) => escape(entry[key]));
    lines.push(row.join(','));
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'visitor-log.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function init() {
  const deviceId = getOrCreateDeviceId();
  const existingEntries = getStoredEntries().map((entry) => ({
    ...entry,
    deviceId: entry.deviceId || deviceId,
  }));
  renderLogEntries(existingEntries);

  const entry = { ...buildBaseEntry(), ...(await resolveGeolocation()) };
  updateCurrentVisit(entry);

  const updatedEntries = [entry, ...existingEntries].slice(0, MAX_LOG_ENTRIES);
  persistEntries(updatedEntries);
  renderLogEntries(updatedEntries);

  selectors.downloadButton?.addEventListener('click', () => {
    downloadCsv(getStoredEntries());
  });
}

document.addEventListener('DOMContentLoaded', init);
