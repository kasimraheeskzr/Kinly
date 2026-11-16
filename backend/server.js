const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5050;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const DIST_PATH = path.join(__dirname, '..', 'frontend', 'dist');

// Helper to read DB
function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return null;
  }
}

// Helper to write DB
function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// Helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Helper to send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;

  // Non-API routes: Serve static frontend files if built
  if (!pathname.startsWith('/api')) {
    let filePath = path.join(DIST_PATH, pathname === '/' ? 'index.html' : pathname);
    
    // SPA fallback: if file doesn't exist, serve index.html
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_PATH, 'index.html');
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      try {
        const fileContent = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        return res.end(fileContent);
      } catch (err) {
        console.error('Static serve error:', err);
      }
    }
  }

  const db = readDb();
  if (!db) {
    return sendJson(res, 500, { error: 'Database unavailable' });
  }

  // 1. Health check
  if (pathname === '/api/health' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'healthy',
      app: 'Kinly Family API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  }

  // 2. Family details
  if (pathname === '/api/family' && method === 'GET') {
    return sendJson(res, 200, db.family);
  }

  if (pathname === '/api/family' && method === 'PUT') {
    const body = await parseBody(req);
    db.family = { ...db.family, ...body };
    writeDb(db);
    return sendJson(res, 200, db.family);
  }

  // 3. Global controls (Pause all internet, bedtime lockdown, etc.)
  if (pathname === '/api/controls' && method === 'GET') {
    return sendJson(res, 200, db.globalControls);
  }

  if (pathname === '/api/controls/toggle' && method === 'POST') {
    const body = await parseBody(req);
    const { key, value } = body;
    if (key in db.globalControls) {
      db.globalControls[key] = typeof value === 'boolean' ? value : !db.globalControls[key];
      
      // If toggling pauseAllInternet, reflect on all devices
      if (key === 'pauseAllInternet') {
        const isPaused = db.globalControls.pauseAllInternet;
        db.devices.forEach(d => { d.internetPaused = isPaused; });
        db.activities.unshift({
          id: `act_${Date.now()}`,
          type: isPaused ? 'pause_all' : 'resume_all',
          title: isPaused ? 'Internet paused for all family devices' : 'Internet resumed for all family devices',
          device: 'All Devices',
          member: 'Sarah Miller',
          time: 'Just now',
          severity: isPaused ? 'alert' : 'success',
          iconBg: isPaused ? '#F9ECE7' : '#EDF3E8',
          iconColor: isPaused ? '#BD725E' : '#71874D'
        });
      }

      // If toggling bedtimeLockdown
      if (key === 'bedtimeLockdown') {
        const isBedtime = db.globalControls.bedtimeLockdown;
        db.devices.forEach(d => { d.bedtimeActive = isBedtime; });
        db.activities.unshift({
          id: `act_${Date.now()}`,
          type: 'bedtime',
          title: isBedtime ? 'Instant Bedtime Lockdown activated' : 'Bedtime mode deactivated',
          device: 'All Devices',
          member: 'Sarah Miller',
          time: 'Just now',
          severity: 'info',
          iconBg: '#EDF4EE',
          iconColor: '#39765C'
        });
      }

      writeDb(db);
      return sendJson(res, 200, {
        success: true,
        controls: db.globalControls,
        devices: db.devices
      });
    }
    return sendJson(res, 400, { error: 'Invalid control key' });
  }

  // 4. Devices CRUD
  if (pathname === '/api/devices' && method === 'GET') {
    return sendJson(res, 200, db.devices);
  }

  if (pathname === '/api/devices' && method === 'POST') {
    const body = await parseBody(req);
    const newDevice = {
      id: `dev_${Date.now()}`,
      name: body.name || 'New Device',
      model: body.model || 'Smartphone',
      type: body.type || 'phone',
      ownerId: body.ownerId || 'mem_1',
      ownerName: body.ownerName || 'Leo',
      status: 'online',
      battery: 100,
      screenTimeTodayMinutes: 0,
      limitMinutes: body.limitMinutes || 120,
      internetPaused: false,
      bedtimeActive: false,
      currentApp: 'Home Screen',
      lastActive: 'Just now',
      location: body.location || 'Home',
      ipAddress: `192.168.1.${Math.floor(Math.random() * 100) + 130}`,
      osVersion: body.osVersion || 'iOS 17',
      isPhoneConnected: true,
      pairCode: `KIN-${Math.floor(1000 + Math.random() * 9000)}`
    };

    db.devices.push(newDevice);
    db.activities.unshift({
      id: `act_${Date.now()}`,
      type: 'paired',
      title: `New device paired: ${newDevice.name}`,
      device: newDevice.name,
      member: newDevice.ownerName,
      time: 'Just now',
      severity: 'success',
      iconBg: '#EDF3E8',
      iconColor: '#71874D'
    });

    writeDb(db);
    return sendJson(res, 201, newDevice);
  }

  // Single device operations: /api/devices/:id/...
  const deviceMatch = pathname.match(/^\/api\/devices\/([^/]+)(\/(toggle-internet|bonus-time))?$/);
  if (deviceMatch) {
    const deviceId = deviceMatch[1];
    const subAction = deviceMatch[3];
    const devIndex = db.devices.findIndex(d => d.id === deviceId);

    if (devIndex === -1) {
      return sendJson(res, 404, { error: 'Device not found' });
    }

    if (!subAction && method === 'PATCH') {
      const body = await parseBody(req);
      db.devices[devIndex] = { ...db.devices[devIndex], ...body };
      writeDb(db);
      return sendJson(res, 200, db.devices[devIndex]);
    }

    if (!subAction && method === 'DELETE') {
      const removed = db.devices.splice(devIndex, 1)[0];
      writeDb(db);
      return sendJson(res, 200, { success: true, removed });
    }

    if (subAction === 'toggle-internet' && method === 'POST') {
      const dev = db.devices[devIndex];
      dev.internetPaused = !dev.internetPaused;
      db.activities.unshift({
        id: `act_${Date.now()}`,
        type: dev.internetPaused ? 'device_paused' : 'device_resumed',
        title: dev.internetPaused ? `Internet paused on ${dev.name}` : `Internet restored on ${dev.name}`,
        device: dev.name,
        member: dev.ownerName,
        time: 'Just now',
        severity: dev.internetPaused ? 'warning' : 'success',
        iconBg: dev.internetPaused ? '#F9ECE7' : '#EDF3E8',
        iconColor: dev.internetPaused ? '#BD725E' : '#71874D'
      });
      writeDb(db);
      return sendJson(res, 200, dev);
    }

    if (subAction === 'bonus-time' && method === 'POST') {
      const body = await parseBody(req);
      const minutes = body.minutes || 30;
      const dev = db.devices[devIndex];
      dev.limitMinutes += minutes;
      db.activities.unshift({
        id: `act_${Date.now()}`,
        type: 'bonus_time',
        title: `+${minutes}m bonus time granted to ${dev.name}`,
        device: dev.name,
        member: dev.ownerName,
        time: 'Just now',
        severity: 'info',
        iconBg: '#EDF4EE',
        iconColor: '#39765C'
      });
      writeDb(db);
      return sendJson(res, 200, dev);
    }
  }

  // 5. Screen Time metrics
  if (pathname === '/api/screentime' && method === 'GET') {
    return sendJson(res, 200, db.screentime);
  }

  // 6. Activities & Alerts
  if (pathname === '/api/activities' && method === 'GET') {
    return sendJson(res, 200, db.activities);
  }

  if (pathname === '/api/activities' && method === 'POST') {
    const body = await parseBody(req);
    const newAct = {
      id: `act_${Date.now()}`,
      time: 'Just now',
      severity: body.severity || 'info',
      iconBg: body.iconBg || '#EDF4EE',
      iconColor: body.iconColor || '#39765C',
      ...body
    };
    db.activities.unshift(newAct);
    writeDb(db);
    return sendJson(res, 201, newAct);
  }

  // 7. Rules & Web Filter
  if (pathname === '/api/rules' && method === 'GET') {
    return sendJson(res, 200, db.contentRules);
  }

  if (pathname === '/api/rules' && method === 'PUT') {
    const body = await parseBody(req);
    db.contentRules = { ...db.contentRules, ...body };
    writeDb(db);
    return sendJson(res, 200, db.contentRules);
  }

  // 8. Subscription & Payments / Orders
  if (pathname === '/api/subscription' && method === 'GET') {
    return sendJson(res, 200, {
      subscription: db.subscription,
      orders: db.orders
    });
  }

  if (pathname === '/api/checkout' && method === 'POST') {
    const body = await parseBody(req);
    const { planName, billingCycle, amount, paymentMethod } = body;

    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      plan: `${planName || 'Kinly Family Plus'} (${billingCycle || 'Monthly'})`,
      amount: amount || 9.99,
      status: 'Paid',
      paymentMethod: paymentMethod?.brand ? `${paymentMethod.brand} **** ${paymentMethod.last4 || '4242'}` : 'Credit Card **** 4242',
      invoiceNumber: invoiceNum
    };

    // Update active subscription
    db.subscription.currentPlan = planName || db.subscription.currentPlan;
    db.subscription.billingCycle = billingCycle || db.subscription.billingCycle;
    db.subscription.amount = amount || db.subscription.amount;
    db.subscription.status = 'Active';
    db.subscription.renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (paymentMethod && paymentMethod.last4) {
      db.subscription.paymentMethod = {
        brand: paymentMethod.brand || 'Visa',
        last4: paymentMethod.last4,
        expiry: paymentMethod.expiry || '12/28'
      };
    }

    db.orders.unshift(newOrder);

    db.activities.unshift({
      id: `act_${Date.now()}`,
      type: 'payment',
      title: `Payment successful: ${newOrder.plan} ($${newOrder.amount})`,
      device: 'Billing Portal',
      member: 'Sarah Miller',
      time: 'Just now',
      severity: 'success',
      iconBg: '#EDF3E8',
      iconColor: '#71874D'
    });

    writeDb(db);
    return sendJson(res, 201, {
      success: true,
      order: newOrder,
      subscription: db.subscription
    });
  }

  // 9. Phone Connection & Pairing Flow
  if (pathname === '/api/pairing/generate' && method === 'POST') {
    const body = await parseBody(req);
    const code = `KIN-${Math.floor(1000 + Math.random() * 9000)}`;
    const session = {
      code,
      deviceId: body.deviceId || 'dev_new',
      deviceName: body.deviceName || "Child's Phone",
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=kinly://pair?code=${code}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };
    db.pairingSessions.unshift(session);
    writeDb(db);
    return sendJson(res, 200, session);
  }

  // Check phone status by code
  const phoneStatusMatch = pathname.match(/^\/api\/phone-status\/([^/]+)$/);
  if (phoneStatusMatch && method === 'GET') {
    const code = phoneStatusMatch[1];
    const dev = db.devices.find(d => d.pairCode === code);
    return sendJson(res, 200, {
      paired: !!dev,
      device: dev || null,
      globalControls: db.globalControls
    });
  }

  // Default 404
  return sendJson(res, 404, { error: 'Endpoint not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Kinly Server running on:`);
  console.log(`- Local:   http://localhost:${PORT}`);
  console.log(`- Network: http://192.168.1.55:${PORT} (Open on your phone!)`);
});
