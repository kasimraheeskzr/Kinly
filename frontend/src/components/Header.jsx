import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Wifi, 
  WifiOff, 
  QrCode, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Smartphone
} from 'lucide-react';

export default function Header({ 
  family, 
  globalControls, 
  onTogglePauseAll, 
  onOpenAddDevice, 
  onOpenPairing,
  setIsMobileOpen,
  notificationCount = 3
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const isPaused = globalControls?.pauseAllInternet;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E7EBE5] px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
        
        {/* Left: Mobile Toggle & Welcome Message */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-1 text-[#21352D] hover:bg-[#F6F7F5] rounded-xl lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl lg:text-2xl font-bold text-[#21352D] tracking-tight">
                Good morning, {family?.admin?.name?.split(' ')[0] || 'Sarah'}
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EDF4EE] text-[#39765C]">
                4 Devices Active
              </span>
            </div>
            <p className="text-xs lg:text-sm text-[#748078] hidden sm:block">
              Here is what is happening across your family devices today.
            </p>
          </div>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Search bar */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#748078]" />
            <input
              type="text"
              placeholder="Search devices, apps..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F7F5] border border-transparent focus:border-[#39765C] focus:bg-white rounded-xl outline-none text-[#21352D] placeholder-[#748078] transition-all"
            />
          </div>

          {/* Connect Phone Quick Action */}
          <button
            onClick={onOpenPairing}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-[#39765C] bg-[#EDF4EE] hover:bg-[#dce9de] rounded-xl border border-[#39765C]/20 transition-all shadow-xs"
            title="Connect your child's phone via QR code"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#39765C]" />
            <span className="hidden sm:inline">Connect Phone</span>
            <span className="sm:hidden">Pair</span>
          </button>

          {/* Pause All Internet Toggle Button */}
          <button
            onClick={onTogglePauseAll}
            className={`
              flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs
              ${isPaused 
                ? 'bg-[#BD725E] hover:bg-[#a65f4d] text-white animate-pulse' 
                : 'bg-white hover:bg-[#F6F7F5] text-[#21352D] border border-[#E7EBE5]'
              }
            `}
            title={isPaused ? "Resume Internet for all devices" : "Pause Internet on all family devices"}
          >
            {isPaused ? (
              <>
                <WifiOff className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Internet Paused</span>
                <span className="sm:hidden">Paused</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-[#39765C]" />
                <span className="hidden sm:inline">Pause All Internet</span>
                <span className="sm:hidden">Pause</span>
              </>
            )}
          </button>

          {/* Add Device Button */}
          <button
            onClick={onOpenAddDevice}
            className="flex items-center space-x-1.5 px-3 py-2 bg-[#39765C] hover:bg-[#2e614c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Add Device</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-[#748078] hover:text-[#21352D] hover:bg-[#F6F7F5] rounded-xl relative transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#BD725E] rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E7EBE5] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#E7EBE5] mb-2 px-1">
                  <h4 className="text-xs font-bold text-[#21352D]">Family Safety Alerts</h4>
                  <span className="text-[10px] text-[#39765C] font-semibold bg-[#EDF4EE] px-2 py-0.5 rounded-full">
                    3 New
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-[#F9ECE7] rounded-xl flex items-start space-x-2.5 text-left">
                    <AlertTriangle className="w-4 h-4 text-[#BD725E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#21352D]">YouTube Kids Limit Reached</p>
                      <p className="text-[11px] text-[#748078]">Leo's iPad exceeded 120m today.</p>
                      <span className="text-[10px] text-[#BD725E] font-medium">12m ago</span>
                    </div>
                  </div>
                  <div className="p-2 bg-[#EDF3E8] rounded-xl flex items-start space-x-2.5 text-left">
                    <CheckCircle2 className="w-4 h-4 text-[#71874D] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#21352D]">Arrived at School Safe Zone</p>
                      <p className="text-[11px] text-[#748078]">Maya's iPhone connected to School Wi-Fi.</p>
                      <span className="text-[10px] text-[#71874D] font-medium">1h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
