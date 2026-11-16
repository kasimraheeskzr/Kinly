import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Battery, 
  Lock, 
  ShieldCheck, 
  Clock, 
  QrCode, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

export default function PhoneCompanionModal({ isOpen, onClose, devices, globalControls, onGrantBonusTime }) {
  const [selectedDevice, setSelectedDevice] = useState(devices?.[1] || devices?.[0]);
  const [copied, setCopied] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (devices && devices.length > 0) {
      setSelectedDevice(devices.find(d => d.type === 'phone') || devices[0]);
    }
  }, [devices]);

  if (!isOpen) return null;

  const isInternetPaused = globalControls?.pauseAllInternet || selectedDevice?.internetPaused;
  const isBedtime = globalControls?.bedtimeLockdown || selectedDevice?.bedtimeActive;

  // Local phone connect URL
  const localConnectUrl = `${window.location.origin}?mode=companion&code=${selectedDevice?.pairCode || 'KIN-7842'}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(localConnectUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(localConnectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestTime = () => {
    setRequestSent(true);
    setTimeout(() => {
      onGrantBonusTime(selectedDevice.id, 15);
      setRequestSent(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-4xl w-full border border-[#E7EBE5] shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E7EBE5] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF4EE] flex items-center justify-center text-[#39765C]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#21352D]">
                Connect Real Phone & Live Companion Simulator
              </h3>
              <p className="text-xs text-[#748078]">
                Pair with physical iOS / Android phone or test live controls in the simulator
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#748078] hover:text-[#21352D] hover:bg-[#F6F7F5] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Two Columns */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: QR Code & Real Phone Pairing Instructions (7 Cols) */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EDF4EE] text-[#39765C]">
                Option 1: Real Mobile Connection
              </span>
              <h4 className="text-lg font-bold text-[#21352D] mt-2">
                Scan with any Smartphone Camera
              </h4>
              <p className="text-xs text-[#748078] leading-relaxed mt-1">
                Open the camera app on your iPhone or Android and scan the QR code below to connect this device immediately.
              </p>
            </div>

            {/* QR Card */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-[#F6F7F5] rounded-2xl border border-[#E7EBE5]">
              <div className="p-2 bg-white rounded-xl shadow-xs border border-[#E7EBE5] shrink-0">
                <img 
                  src={qrCodeUrl} 
                  alt="Kinly Companion QR Code" 
                  className="w-36 h-36 object-contain"
                />
              </div>

              <div className="space-y-3 text-left">
                <div>
                  <span className="text-[10px] font-bold text-[#748078] uppercase tracking-wider block">
                    Pairing Code
                  </span>
                  <span className="text-2xl font-mono font-extrabold text-[#39765C] tracking-widest">
                    {selectedDevice?.pairCode || 'KIN-7842'}
                  </span>
                </div>

                <div className="text-xs text-[#748078] space-y-1">
                  <p>✓ Instant real-time push sync</p>
                  <p>✓ Remote pause & bedtime lockdown</p>
                  <p>✓ No App Store installation required</p>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-[#EDF4EE] text-[#21352D] text-xs font-semibold rounded-lg border border-[#E7EBE5] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#39765C]" /> : <Copy className="w-3.5 h-3.5 text-[#748078]" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Mobile Link'}</span>
                </button>
              </div>
            </div>

            {/* Device Switcher */}
            <div>
              <label className="block text-xs font-bold text-[#748078] mb-2 uppercase tracking-wider">
                Select device to preview in simulator:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {devices?.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDevice(d)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      selectedDevice?.id === d.id
                        ? 'border-[#39765C] bg-[#EDF4EE] text-[#39765C]'
                        : 'border-[#E7EBE5] hover:bg-[#F6F7F5] text-[#21352D]'
                    }`}
                  >
                    <p className="truncate">{d.name}</p>
                    <span className="text-[10px] font-normal text-[#748078]">{d.ownerName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Live Interactive Phone Simulator (5 Cols) */}
          <div className="md:col-span-5 flex justify-center">
            
            {/* Phone Bezel Frame */}
            <div className="w-[280px] h-[540px] bg-[#1E1E1E] rounded-[44px] p-3 shadow-2xl ring-4 ring-[#E7EBE5] relative flex flex-col justify-between overflow-hidden">
              
              {/* Dynamic Island / Speaker notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30"></div>

              {/* Phone Screen Display */}
              <div className="w-full h-full bg-[#F6F7F5] rounded-[34px] overflow-hidden flex flex-col justify-between relative text-left">
                
                {/* Phone Status Bar */}
                <div className="px-5 pt-3 pb-1 flex justify-between items-center text-[10px] font-bold text-[#21352D] z-20">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1.5">
                    {isInternetPaused ? <WifiOff className="w-3 h-3 text-[#BD725E]" /> : <Wifi className="w-3 h-3 text-[#39765C]" />}
                    <span>{selectedDevice?.battery || 78}%</span>
                    <Battery className="w-3.5 h-3.5 text-[#39765C]" />
                  </div>
                </div>

                {/* Main Screen Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  
                  {/* Supervisor Pill */}
                  <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-full border border-[#E7EBE5] shadow-xs mb-3">
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#39765C]" />
                      <span className="text-[10px] font-bold text-[#21352D]">Kinly Family Safe</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#71874D]">Protected</span>
                  </div>

                  {/* If Internet Paused Screen Overlay */}
                  {isInternetPaused ? (
                    <div className="my-auto text-center p-4 bg-[#F9ECE7] rounded-2xl border border-[#F0D5CD] animate-in zoom-in-95 duration-200">
                      <div className="w-12 h-12 rounded-full bg-[#BD725E]/20 text-[#BD725E] flex items-center justify-center mx-auto mb-2">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h5 className="text-sm font-bold text-[#21352D]">Internet is Paused</h5>
                      <p className="text-[11px] text-[#748078] mt-1 leading-snug">
                        Your parents paused internet on this device for family or homework time.
                      </p>
                      
                      <button
                        onClick={handleRequestTime}
                        disabled={requestSent}
                        className="mt-4 w-full py-2 bg-[#39765C] hover:bg-[#2e614c] text-white text-[11px] font-bold rounded-xl transition-all shadow-xs"
                      >
                        {requestSent ? 'Request Sent!' : 'Ask for +15m Bonus'}
                      </button>
                    </div>
                  ) : (
                    /* Normal Active Screen Time View */
                    <div className="space-y-3">
                      {/* Big Time Countdown */}
                      <div className="bg-white p-4 rounded-2xl border border-[#E7EBE5] text-center shadow-xs">
                        <span className="text-[10px] text-[#748078] font-bold uppercase tracking-wider block">
                          Remaining Today
                        </span>
                        <div className="text-2xl font-extrabold text-[#39765C] my-1">
                          {Math.max(0, (selectedDevice?.limitMinutes || 120) - (selectedDevice?.screenTimeTodayMinutes || 105))}m
                        </div>
                        <div className="w-full h-1.5 bg-[#EDEFE9] rounded-full overflow-hidden mt-2">
                          <div 
                            className="bg-[#39765C] h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.round(((selectedDevice?.screenTimeTodayMinutes || 105) / (selectedDevice?.limitMinutes || 120)) * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* Active Allowed Apps */}
                      <div className="bg-white p-3 rounded-2xl border border-[#E7EBE5] space-y-2">
                        <span className="text-[10px] text-[#748078] font-bold uppercase block">
                          Current App
                        </span>
                        <div className="flex items-center space-x-2 text-xs font-bold text-[#21352D]">
                          <span className="w-2 h-2 rounded-full bg-[#71874D]"></span>
                          <span>{selectedDevice?.currentApp || 'Duolingo Kids'}</span>
                        </div>
                      </div>

                      {/* App Category Status */}
                      <div className="p-3 bg-[#EDF4EE] rounded-2xl text-[10px] text-[#21352D] space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>Web Filter:</span>
                          <span className="text-[#39765C]">Strict Active</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Bedtime:</span>
                          <span>8:30 PM tonight</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phone Home Bar */}
                  <div className="w-24 h-1 bg-black/20 rounded-full mx-auto mt-3"></div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
