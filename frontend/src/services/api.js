const API_BASE = '/api';

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { status: 'offline' };
    }
  },

  async getFamily() {
    const res = await fetch(`${API_BASE}/family`);
    if (!res.ok) throw new Error('Failed to fetch family');
    return res.json();
  },

  async getControls() {
    const res = await fetch(`${API_BASE}/controls`);
    if (!res.ok) throw new Error('Failed to fetch controls');
    return res.json();
  },

  async toggleControl(key, value) {
    const res = await fetch(`${API_BASE}/controls/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    if (!res.ok) throw new Error('Failed to toggle control');
    return res.json();
  },

  async getDevices() {
    const res = await fetch(`${API_BASE}/devices`);
    if (!res.ok) throw new Error('Failed to fetch devices');
    return res.json();
  },

  async createDevice(deviceData) {
    const res = await fetch(`${API_BASE}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceData)
    });
    if (!res.ok) throw new Error('Failed to create device');
    return res.json();
  },

  async toggleDeviceInternet(deviceId) {
    const res = await fetch(`${API_BASE}/devices/${deviceId}/toggle-internet`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to toggle device internet');
    return res.json();
  },

  async grantBonusTime(deviceId, minutes = 30) {
    const res = await fetch(`${API_BASE}/devices/${deviceId}/bonus-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes })
    });
    if (!res.ok) throw new Error('Failed to grant bonus time');
    return res.json();
  },

  async getScreentime() {
    const res = await fetch(`${API_BASE}/screentime`);
    if (!res.ok) throw new Error('Failed to fetch screentime');
    return res.json();
  },

  async getActivities() {
    const res = await fetch(`${API_BASE}/activities`);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },

  async getRules() {
    const res = await fetch(`${API_BASE}/rules`);
    if (!res.ok) throw new Error('Failed to fetch rules');
    return res.json();
  },

  async updateRules(rules) {
    const res = await fetch(`${API_BASE}/rules`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rules)
    });
    if (!res.ok) throw new Error('Failed to update rules');
    return res.json();
  },

  async getSubscription() {
    const res = await fetch(`${API_BASE}/subscription`);
    if (!res.ok) throw new Error('Failed to fetch subscription');
    return res.json();
  },

  async checkout(orderData) {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to process checkout');
    return res.json();
  },

  async generatePairCode(deviceName, deviceId) {
    const res = await fetch(`${API_BASE}/pairing/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceName, deviceId })
    });
    if (!res.ok) throw new Error('Failed to generate pair code');
    return res.json();
  },

  async getPhoneStatus(code) {
    const res = await fetch(`${API_BASE}/phone-status/${code}`);
    if (!res.ok) throw new Error('Failed to get phone status');
    return res.json();
  }
};
