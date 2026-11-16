import React from 'react';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Watch, 
  Battery, 
  Wifi, 
  WifiOff, 
  MapPin, 
  Plus, 
  MoreVertical,
  QrCode,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function DevicesTab({ 
  devices, 
  onToggleDeviceInternet, 
  onGrantBonusTime, 
  onOpenAddDevice, 
  onOpenPairing 
}) {
  const getDeviceIcon = (type) => {
    switch (type) {
      case 'laptop': return Laptop;
      case 'tablet': return Tablet;
      case 'watch': return Watch;
      default: return Smartphone;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-[22px] border border-[#E7EBE5] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#21352D]">Connected Family Devices</h2>
          <p className="text-xs text-[#748078]">
            {devices?.length || 0} active devices synced with Kinly parental supervision
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenPairing}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#EDF4EE] hover:bg-[#dce9de] text-[#39765C] text-xs font-bold rounded-xl border border-[#39765C]/20 transition-all shadow-xs"
          >
            <QrCode className="w-4 h-4" />
            <span>Connect Companion Phone</span>
          </button>

          <button
            onClick={onOpenAddDevice}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#39765C] hover:bg-[#2e614c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Device</span>
          </button>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {devices?.map((dev) => {
          const Icon = getDeviceIcon(dev.type);
          const percent = Math.min(100, Math.round((dev.screenTimeTodayMinutes / (dev.limitMinutes || 120)) * 100));

          return (
            <div 
              key={dev.id}
              className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDF4EE] flex items-center justify-center text-[#39765C] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-[#21352D]">{dev.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        dev.status === 'online' ? 'bg-[#EDF3E8] text-[#71874D]' : 'bg-[#F6F2DF] text-[#AA8345]'
                      }`}>
                        {dev.status === 'online' ? 'Online' : 'Idle'}
                      </span>
                    </div>
                    <p className="text-xs text-[#748078]">{dev.model} • {dev.osVersion}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs text-[#748078] bg-[#F6F7F5] px-2.5 py-1 rounded-lg">
                  <Battery className="w-4 h-4 text-[#39765C]" />
                  <span className="font-bold">{dev.battery}%</span>
                </div>
              </div>

              {/* Status & Location Details */}
              <div className="grid grid-cols-2 gap-3 py-2 border-y border-[#F0F2EE] text-xs">
                <div>
                  <span className="text-[#748078] block text-[11px]">Assigned to</span>
                  <span className="font-bold text-[#21352D]">{dev.ownerName}</span>
                </div>
                <div>
                  <span className="text-[#748078] block text-[11px]">Current App</span>
                  <span className="font-bold text-[#39765C] truncate block">{dev.currentApp}</span>
                </div>
                <div>
                  <span className="text-[#748078] block text-[11px]">Location</span>
                  <span className="font-medium text-[#21352D] flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-[#BD725E]" />
                    <span className="truncate">{dev.location}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[#748078] block text-[11px]">IP Address</span>
                  <span className="font-mono text-[#748078]">{dev.ipAddress}</span>
                </div>
              </div>

              {/* Screen Time Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#748078]">Today's Screen Time</span>
                  <span className="font-bold text-[#21352D]">
                    {Math.floor(dev.screenTimeTodayMinutes / 60)}h {dev.screenTimeTodayMinutes % 60}m / {Math.floor(dev.limitMinutes / 60)}h
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#EDEFE9] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      percent >= 90 ? 'bg-[#BD725E]' : 'bg-[#39765C]'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onGrantBonusTime(dev.id, 30)}
                    className="px-3 py-1.5 bg-[#EDF4EE] hover:bg-[#d8e8dc] text-[#39765C] text-xs font-bold rounded-xl transition-colors"
                  >
                    +30m Bonus
                  </button>

                  <button
                    onClick={onOpenPairing}
                    className="px-2.5 py-1.5 bg-[#F6F7F5] hover:bg-[#E7EBE5] text-[#21352D] text-xs font-medium rounded-xl transition-colors flex items-center space-x-1"
                    title="Simulate / test on this phone"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#39765C]" />
                    <span className="hidden sm:inline">Phone View</span>
                  </button>
                </div>

                <button
                  onClick={() => onToggleDeviceInternet(dev.id)}
                  className={`
                    flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs
                    ${dev.internetPaused 
                      ? 'bg-[#BD725E] hover:bg-[#a65f4d] text-white' 
                      : 'bg-white hover:bg-[#F6F7F5] text-[#21352D] border border-[#E7EBE5]'
                    }
                  `}
                >
                  {dev.internetPaused ? (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-white" />
                      <span>Paused</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-[#39765C]" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
