import React, { useState } from 'react';
import { 
  Clock, 
  Smartphone, 
  ShieldAlert, 
  Moon, 
  Wifi, 
  WifiOff, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  Battery,
  Shield,
  Plus,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';

export default function OverviewTab({ 
  family, 
  devices, 
  screentime, 
  activities, 
  globalControls, 
  onToggleControl, 
  onToggleDeviceInternet,
  onGrantBonusTime,
  onOpenPairing,
  onOpenAddDevice,
  setActiveTab
}) {
  const [selectedDay, setSelectedDay] = useState('Thu');
  const [memberFilter, setMemberFilter] = useState('all');

  // Filter devices by member if selected
  const filteredDevices = memberFilter === 'all' 
    ? devices 
    : devices.filter(d => d.ownerId === memberFilter);

  const weeklyData = screentime?.weekly || [
    { day: 'Mon', hours: 3.2, minutes: 192 },
    { day: 'Tue', hours: 2.8, minutes: 168 },
    { day: 'Wed', hours: 3.5, minutes: 210 },
    { day: 'Thu', hours: 4.25, minutes: 255, isPeak: true, note: 'Peak: 4h 15m' },
    { day: 'Fri', hours: 3.8, minutes: 228 },
    { day: 'Sat', hours: 4.1, minutes: 246 },
    { day: 'Sun', hours: 3.7, minutes: 222 }
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours), 5);

  return (
    <div className="space-y-6">
      
      {/* 1. Member Selector / Sub-navigation Bar matching Figma rx=14 fill=#EDEFE9 */}
      <div className="bg-[#EDEFE9] p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => setMemberFilter('all')}
            className={`
              flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all
              ${memberFilter === 'all' 
                ? 'bg-white text-[#21352D] shadow-xs' 
                : 'text-[#748078] hover:text-[#21352D]'
              }
            `}
          >
            <span>All Family Devices</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF5ED] text-[#39765C]">
              {devices?.length || 4}
            </span>
          </button>

          {family?.members?.map((member) => (
            <button
              key={member.id}
              onClick={() => setMemberFilter(member.id)}
              className={`
                flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all
                ${memberFilter === member.id 
                  ? 'bg-white text-[#21352D] font-bold shadow-xs' 
                  : 'text-[#748078] hover:text-[#21352D]'
                }
              `}
            >
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-4 h-4 rounded-full object-cover" 
              />
              <span>{member.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75">({member.role})</span>
            </button>
          ))}
        </div>

        {/* Right CTA in Tab Bar */}
        <button
          onClick={onOpenPairing}
          className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-[#39765C] hover:bg-white/60 rounded-xl transition-all"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Connect Phone</span>
        </button>
      </div>

      {/* 2. Top 4 Metric Cards matching Figma Card Layout (h=127, rx=14.5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Screen Time (Highlighted with #EDF4EE tint in Figma) */}
        <div className="bg-[#EDF4EE] border border-[#E7EBE5] rounded-[18px] p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748078]">Total Screen Time Today</span>
            <div className="w-7 h-7 rounded-lg bg-[#39765C]/15 flex items-center justify-center text-[#39765C]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-[#21352D] tracking-tight">
              3h 42m
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="inline-flex items-center text-[11px] font-bold text-[#39765C]">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                -24%
              </span>
              <span className="text-[11px] text-[#748078]">vs yesterday (4h 52m)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Devices */}
        <div className="bg-white border border-[#E7EBE5] rounded-[18px] p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748078]">Active Family Devices</span>
            <div className="w-7 h-7 rounded-lg bg-[#39765C]/10 flex items-center justify-center text-[#39765C]">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-[#21352D] tracking-tight">
              4 of 4
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="inline-flex items-center text-[11px] font-bold text-[#71874D]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                Protected
              </span>
              <span className="text-[11px] text-[#748078]">All safety rules active</span>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Content Filter */}
        <div className="bg-white border border-[#E7EBE5] rounded-[18px] p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748078]">Content Blocked Today</span>
            <div className="w-7 h-7 rounded-lg bg-[#AA8345]/15 flex items-center justify-center text-[#AA8345]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-[#21352D] tracking-tight">
              18 Items
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="text-[11px] font-bold text-[#BD725E]">3 risky URLs</span>
              <span className="text-[11px] text-[#748078]">filtered automatically</span>
            </div>
          </div>
        </div>

        {/* Card 4: Bedtime Routine */}
        <div className="bg-white border border-[#E7EBE5] rounded-[18px] p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#748078]">Bedtime Lockdown</span>
            <div className="w-7 h-7 rounded-lg bg-[#39765C]/10 flex items-center justify-center text-[#39765C]">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-[#21352D] tracking-tight">
              8:30 PM
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="text-[11px] font-semibold text-[#39765C] bg-[#EDF4EE] px-2 py-0.5 rounded-md">
                In 2h 15m
              </span>
              <span className="text-[11px] text-[#748078]">Leo & Maya</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Left Column (Chart + Logs) & Right Column (Protection + Devices) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: 8 Cols on Large Screens */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card: Weekly Screen Time Activity Bar Chart (matching Figma w=715, h=333, rx=17.5) */}
          <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#21352D]">Weekly Screen Time Activity</h3>
                <p className="text-xs text-[#748078]">Daily breakdown across all active devices</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-3 py-1.5 bg-[#F6F7F3] text-[#748078] rounded-lg border border-[#E7EBE5]">
                  Past 7 Days
                </span>
              </div>
            </div>

            {/* Interactive Bar Chart matching Figma exact colors (#C6D9C8 & #39765C) */}
            <div className="h-44 flex items-end justify-between gap-3 px-2 pt-6 pb-2 border-b border-[#F0F2EE]">
              {weeklyData.map((item) => {
                const heightPercent = Math.round((item.hours / maxHours) * 100);
                const isSelected = selectedDay === item.day;
                const isPeak = item.isPeak;

                return (
                  <div 
                    key={item.day}
                    onClick={() => setSelectedDay(item.day)}
                    className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                  >
                    {/* Tooltip on peak day or hover matching Figma tooltip rx=6 fill=#21352D */}
                    {(isPeak || isSelected) && (
                      <div className="absolute -top-7 px-2 py-0.5 bg-[#21352D] text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-md animate-in fade-in">
                        {item.hours}h ({item.minutes}m)
                      </div>
                    )}

                    <div 
                      className={`
                        w-full max-w-[42px] rounded-t-lg transition-all duration-300
                        ${isPeak || isSelected 
                          ? 'bg-[#39765C] shadow-sm' 
                          : 'bg-[#C6D9C8] hover:bg-[#b0ccb3]'
                        }
                      `}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className={`text-[11px] mt-2 font-medium ${isSelected ? 'font-bold text-[#39765C]' : 'text-[#748078]'}`}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend & Insights matching Figma footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-[#748078] pt-1">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#39765C]"></span>
                  <span>Peak Day ({selectedDay}: 4h 15m)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#C6D9C8]"></span>
                  <span>Daily Average (3h 18m)</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('screentime')}
                className="text-[#39765C] font-semibold hover:underline flex items-center space-x-1 text-xs"
              >
                <span>View Full Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card: Recent Activity & Safety Alerts (matching Figma y=824.5, w=715, h=255) */}
          <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-[#21352D]">Recent Activity & Safety Logs</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDF4EE] text-[#39765C]">
                  Live
                </span>
              </div>
              <span className="text-xs text-[#748078]">Today</span>
            </div>

            {/* Activity rows matching Figma colors (#F9ECE7, #EDF3E8, #F6F2DF) */}
            <div className="space-y-3">
              {activities?.slice(0, 4).map((act) => (
                <div 
                  key={act.id} 
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F6F7F5] transition-colors border border-transparent hover:border-[#E7EBE5]"
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Badge container with exact colors */}
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: act.iconBg || '#EDF4EE', color: act.iconColor || '#39765C' }}
                    >
                      {act.severity === 'warning' && <Clock className="w-4 h-4" />}
                      {act.severity === 'success' && <CheckCircle2 className="w-4 h-4" />}
                      {act.severity === 'alert' && <AlertTriangle className="w-4 h-4" />}
                      {act.severity === 'info' && <Shield className="w-4 h-4" />}
                    </div>

                    <div>
                      <p className="text-xs lg:text-sm font-semibold text-[#21352D]">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-[#748078]">
                        {act.device} • {act.member}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-[#748078] font-medium shrink-0 ml-2">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 4 Cols on Large Screens (Controls & Connected Devices) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Card: Instant Protection & Controls matching Figma w=383, h=333 */}
          <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#21352D]">Instant Protection</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#39765C] bg-[#EDF4EE] px-2 py-0.5 rounded-md">
                Fast Action
              </span>
            </div>

            <div className="space-y-4">
              {/* Toggle 1: Pause Internet */}
              <div className="flex items-center justify-between p-3 bg-[#F6F7F5] rounded-xl border border-[#E7EBE5]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#39765C]/10 flex items-center justify-center text-[#39765C]">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#21352D]">Pause Internet</p>
                    <p className="text-[10px] text-[#748078]">Block Wi-Fi on all devices</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={globalControls?.pauseAllInternet || false}
                    onChange={(e) => onToggleControl('pauseAllInternet', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-[#D9DFD7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39765C]"></div>
                </label>
              </div>

              {/* Toggle 2: Bedtime Lockdown */}
              <div className="flex items-center justify-between p-3 bg-[#F6F7F5] rounded-xl border border-[#E7EBE5]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#39765C]/10 flex items-center justify-center text-[#39765C]">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#21352D]">Bedtime Lockdown</p>
                    <p className="text-[10px] text-[#748078]">Scheduled for 8:30 PM</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={globalControls?.bedtimeLockdown || false}
                    onChange={(e) => onToggleControl('bedtimeLockdown', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-[#D9DFD7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39765C]"></div>
                </label>
              </div>

              {/* Toggle 3: SafeSearch Enforced */}
              <div className="flex items-center justify-between p-3 bg-[#F6F7F5] rounded-xl border border-[#E7EBE5]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#39765C]/10 flex items-center justify-center text-[#39765C]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#21352D]">SafeSearch & YouTube</p>
                    <p className="text-[10px] text-[#748078]">Filter explicit searches</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={globalControls?.safeSearchEnforced || false}
                    onChange={(e) => onToggleControl('safeSearchEnforced', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-[#D9DFD7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39765C]"></div>
                </label>
              </div>
            </div>

            {/* Bottom Primary Button matching Figma button w=336, h=38 fill=#39765C */}
            <button
              onClick={() => onToggleControl('pauseAllInternet', !globalControls?.pauseAllInternet)}
              className="w-full mt-4 py-2.5 bg-[#39765C] hover:bg-[#2e614c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{globalControls?.pauseAllInternet ? 'Restore Family Internet' : 'Apply Instant Lockdown'}</span>
            </button>
          </div>

          {/* Card: Connected Family Devices matching Figma y=824.5, w=383, h=255 */}
          <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#21352D]">Connected Devices</h3>
              <span className="text-[11px] font-bold text-[#39765C] bg-[#EDF4EE] px-2.5 py-0.5 rounded-full">
                {devices?.filter(d => d.status === 'online').length || 4} Online
              </span>
            </div>

            <div className="space-y-3">
              {filteredDevices?.slice(0, 4).map((device) => {
                const percent = Math.min(100, Math.round((device.screenTimeTodayMinutes / (device.limitMinutes || 120)) * 100));
                
                return (
                  <div 
                    key={device.id}
                    className="p-3 bg-[#F6F7F5] rounded-xl border border-[#E7EBE5] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#39765C] shadow-xs">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white ${
                          device.status === 'online' ? 'bg-[#71874D]' : 'bg-[#AA8345]'
                        }`}></span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-1.5">
                          <p className="text-xs font-bold text-[#21352D]">{device.name}</p>
                          <span className="text-[10px] text-[#748078]">({device.battery}%)</span>
                        </div>
                        <p className="text-[11px] text-[#748078]">
                          {device.currentApp} • {Math.floor(device.screenTimeTodayMinutes / 60)}h {device.screenTimeTodayMinutes % 60}m used
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onGrantBonusTime(device.id, 30)}
                        title="Grant +30m bonus time"
                        className="px-2 py-1 bg-white hover:bg-[#EDF4EE] text-[#39765C] text-[10px] font-bold rounded-lg border border-[#E7EBE5] transition-colors"
                      >
                        +30m
                      </button>
                      <button
                        onClick={() => onToggleDeviceInternet(device.id)}
                        title={device.internetPaused ? "Resume Internet" : "Pause Internet"}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                          device.internetPaused
                            ? 'bg-[#BD725E] text-white border-transparent'
                            : 'bg-white text-[#748078] hover:text-[#BD725E] border-[#E7EBE5]'
                        }`}
                      >
                        {device.internetPaused ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('devices')}
              className="w-full mt-4 py-2 bg-white hover:bg-[#F6F7F5] border border-[#E7EBE5] text-xs font-semibold text-[#748078] hover:text-[#21352D] rounded-xl transition-colors flex items-center justify-center space-x-1"
            >
              <span>Manage All Devices</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
