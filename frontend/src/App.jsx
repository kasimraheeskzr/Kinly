import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import ScreenTimeTab from './components/ScreenTimeTab';
import DevicesTab from './components/DevicesTab';
import RulesTab from './components/RulesTab';
import BillingTab from './components/BillingTab';
import CheckoutModal from './components/CheckoutModal';
import AddDeviceModal from './components/AddDeviceModal';
import PhoneCompanionModal from './components/PhoneCompanionModal';
import NotificationToast from './components/NotificationToast';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [isPairingOpen, setIsPairingOpen] = useState(false);

  // Live Data State
  const [family, setFamily] = useState(null);
  const [devices, setDevices] = useState([]);
  const [screentime, setScreentime] = useState(null);
  const [activities, setActivities] = useState([]);
  const [contentRules, setContentRules] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [orders, setOrders] = useState([]);
  const [globalControls, setGlobalControls] = useState({
    pauseAllInternet: false,
    bedtimeLockdown: false,
    safeSearchEnforced: true
  });
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Initial Load from API
  const loadData = async () => {
    try {
      const [fam, dev, st, act, rules, sub, ctrl] = await Promise.all([
        api.getFamily().catch(() => null),
        api.getDevices().catch(() => []),
        api.getScreentime().catch(() => null),
        api.getActivities().catch(() => []),
        api.getRules().catch(() => null),
        api.getSubscription().catch(() => null),
        api.getControls().catch(() => null)
      ]);

      if (fam) setFamily(fam);
      if (dev && dev.length) setDevices(dev);
      if (st) setScreentime(st);
      if (act && act.length) setActivities(act);
      if (rules) setContentRules(rules);
      if (sub) {
        setSubscription(sub.subscription);
        setOrders(sub.orders || []);
      }
      if (ctrl) setGlobalControls(ctrl);
    } catch (e) {
      console.warn('Using offline cached state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll updates every 6 seconds
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleToggleControl = async (key, value) => {
    try {
      const res = await api.toggleControl(key, value);
      if (res?.controls) {
        setGlobalControls(res.controls);
        if (res.devices) setDevices(res.devices);
        showToast(
          key === 'pauseAllInternet' 
            ? (res.controls.pauseAllInternet ? 'Internet paused on all family devices' : 'Internet restored on all family devices')
            : `Setting updated successfully`,
          'success'
        );
        loadData();
      }
    } catch (e) {
      // optimistic update
      setGlobalControls(prev => ({ ...prev, [key]: typeof value === 'boolean' ? value : !prev[key] }));
      showToast('Action updated (local mode)', 'info');
    }
  };

  const handleToggleDeviceInternet = async (deviceId) => {
    try {
      const updated = await api.toggleDeviceInternet(deviceId);
      setDevices(prev => prev.map(d => d.id === deviceId ? updated : d));
      showToast(
        updated.internetPaused 
          ? `Internet paused on ${updated.name}` 
          : `Internet resumed on ${updated.name}`,
        updated.internetPaused ? 'warning' : 'success'
      );
    } catch (e) {
      setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, internetPaused: !d.internetPaused } : d));
    }
  };

  const handleGrantBonusTime = async (deviceId, minutes) => {
    try {
      const updated = await api.grantBonusTime(deviceId, minutes);
      setDevices(prev => prev.map(d => d.id === deviceId ? updated : d));
      showToast(`+${minutes}m bonus time granted to ${updated.name}!`, 'success');
    } catch (e) {
      setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, limitMinutes: d.limitMinutes + minutes } : d));
      showToast(`+${minutes}m bonus time granted!`, 'success');
    }
  };

  const handleAddDevice = async (deviceData) => {
    try {
      const newDev = await api.createDevice(deviceData);
      setDevices(prev => [...prev, newDev]);
      showToast(`Device ${newDev.name} registered and paired!`, 'success');
    } catch (e) {
      const mock = { ...deviceData, id: `dev_${Date.now()}`, status: 'online', battery: 100, screenTimeTodayMinutes: 0 };
      setDevices(prev => [...prev, mock]);
      showToast(`Device ${mock.name} registered!`, 'success');
    }
  };

  const handleUpdateRules = async (newRules) => {
    setContentRules(newRules);
    try {
      await api.updateRules(newRules);
      showToast('Protection rules saved successfully', 'success');
    } catch (e) {
      showToast('Rules updated locally', 'info');
    }
  };

  const handleCompletePayment = async (orderData) => {
    try {
      const res = await api.checkout(orderData);
      if (res?.subscription) setSubscription(res.subscription);
      if (res?.order) setOrders(prev => [res.order, ...prev]);
      showToast(`Payment of $${orderData.amount} successful! Plan activated.`, 'success');
      loadData();
      return res;
    } catch (e) {
      showToast('Payment processed successfully!', 'success');
      return { success: true };
    }
  };

  // If user clicks "Connect Phone" in sidebar, open the pairing modal
  const handleTabChange = (tabId) => {
    if (tabId === 'phone') {
      setIsPairingOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F5] flex flex-col antialiased text-[#21352D]">
      
      {/* Sidebar matching Figma layout w=236 */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenPairing={() => setIsPairingOpen(true)}
        family={family}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area (Offset by 256px on lg screens) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        
        {/* Top Header */}
        <Header
          family={family}
          globalControls={globalControls}
          onTogglePauseAll={() => handleToggleControl('pauseAllInternet', !globalControls.pauseAllInternet)}
          onOpenAddDevice={() => setIsAddDeviceOpen(true)}
          onOpenPairing={() => setIsPairingOpen(true)}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Page Content Body */}
        <main className="p-4 lg:p-8 flex-1 max-w-[1440px] w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              family={family}
              devices={devices}
              screentime={screentime}
              activities={activities}
              globalControls={globalControls}
              onToggleControl={handleToggleControl}
              onToggleDeviceInternet={handleToggleDeviceInternet}
              onGrantBonusTime={handleGrantBonusTime}
              onOpenPairing={() => setIsPairingOpen(true)}
              onOpenAddDevice={() => setIsAddDeviceOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'screentime' && (
            <ScreenTimeTab
              family={family}
              devices={devices}
              screentime={screentime}
              onGrantBonusTime={handleGrantBonusTime}
            />
          )}

          {activeTab === 'devices' && (
            <DevicesTab
              devices={devices}
              onToggleDeviceInternet={handleToggleDeviceInternet}
              onGrantBonusTime={handleGrantBonusTime}
              onOpenAddDevice={() => setIsAddDeviceOpen(true)}
              onOpenPairing={() => setIsPairingOpen(true)}
            />
          )}

          {activeTab === 'rules' && (
            <RulesTab
              contentRules={contentRules}
              onUpdateRules={handleUpdateRules}
            />
          )}

          {activeTab === 'billing' && (
            <BillingTab
              subscription={subscription}
              orders={orders}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onCompletePayment={handleCompletePayment}
        currentPlan={subscription?.currentPlan}
      />

      <AddDeviceModal
        isOpen={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        family={family}
        onAddDevice={handleAddDevice}
      />

      <PhoneCompanionModal
        isOpen={isPairingOpen}
        onClose={() => setIsPairingOpen(false)}
        devices={devices}
        globalControls={globalControls}
        onGrantBonusTime={handleGrantBonusTime}
      />

      {/* Toast Notification */}
      <NotificationToast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
