import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Watch, 
  CheckCircle,
  Plus
} from 'lucide-react';

export default function AddDeviceModal({ isOpen, onClose, family, onAddDevice }) {
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('phone');
  const [ownerId, setOwnerId] = useState(family?.members?.[0]?.id || 'mem_1');
  const [limitMinutes, setLimitMinutes] = useState(120);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const owner = family?.members?.find(m => m.id === ownerId);
    
    onAddDevice({
      name: deviceName.trim() || `${owner?.name?.split(' ')[0]}'s Device`,
      type: deviceType,
      ownerId,
      ownerName: owner?.name?.split(' ')[0] || 'Child',
      limitMinutes: Number(limitMinutes),
      model: deviceType === 'phone' ? 'Apple iPhone 15' : deviceType === 'tablet' ? 'iPad Air' : 'MacBook Pro'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-md w-full border border-[#E7EBE5] shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E7EBE5] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EDF4EE] flex items-center justify-center text-[#39765C]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#21352D]">Add Family Device</h3>
              <p className="text-xs text-[#748078]">Connect a new child phone, tablet or laptop</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#748078] hover:text-[#21352D] hover:bg-[#F6F7F5] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#748078] mb-1.5 uppercase tracking-wider text-[11px]">
              Device Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Leo's iPhone"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F6F7F5] border border-[#E7EBE5] rounded-xl outline-none focus:border-[#39765C] text-[#21352D] text-xs font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-[#748078] mb-1.5 uppercase tracking-wider text-[11px]">
              Device Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'phone', label: 'Phone', icon: Smartphone },
                { type: 'tablet', label: 'Tablet', icon: Tablet },
                { type: 'laptop', label: 'Laptop', icon: Laptop },
                { type: 'watch', label: 'Watch', icon: Watch }
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setDeviceType(t.type)}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                      deviceType === t.type 
                        ? 'border-[#39765C] bg-[#EDF4EE] text-[#39765C] font-bold' 
                        : 'border-[#E7EBE5] text-[#748078] hover:bg-[#F6F7F5]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px]">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#748078] mb-1.5 uppercase tracking-wider text-[11px]">
              Assign to Family Member
            </label>
            <select
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F6F7F5] border border-[#E7EBE5] rounded-xl outline-none focus:border-[#39765C] text-[#21352D] text-xs font-medium"
            >
              {family?.members?.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#748078] mb-1.5 uppercase tracking-wider text-[11px]">
              Daily Allowed Screen Time Limit
            </label>
            <select
              value={limitMinutes}
              onChange={(e) => setLimitMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#F6F7F5] border border-[#E7EBE5] rounded-xl outline-none focus:border-[#39765C] text-[#21352D] text-xs font-medium"
            >
              <option value={60}>1 hour per day</option>
              <option value={90}>1 hour 30 mins per day</option>
              <option value={120}>2 hours per day (Recommended)</option>
              <option value={180}>3 hours per day</option>
              <option value={240}>4 hours per day</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#39765C] hover:bg-[#2e614c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Register & Generate Pair Code</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
