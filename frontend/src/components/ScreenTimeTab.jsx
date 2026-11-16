import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Sliders, 
  Calendar,
  Sparkles,
  ChevronRight,
  Smartphone
} from 'lucide-react';

export default function ScreenTimeTab({ family, devices, screentime, onGrantBonusTime }) {
  const [selectedChild, setSelectedChild] = useState(family?.members?.[0]?.id || 'mem_1');

  const child = family?.members?.find(m => m.id === selectedChild) || family?.members?.[0];
  const childDevice = devices?.find(d => d.ownerId === child?.id) || devices?.[0];

  const categories = screentime?.categories || [
    { name: "Educational & Learning", minutes: 82, percentage: 37, color: "#39765C" },
    { name: "Entertainment & Video", minutes: 74, percentage: 33, color: "#C6D9C8" },
    { name: "Gaming", minutes: 44, percentage: 20, color: "#BD725E" },
    { name: "Social & Messaging", minutes: 22, percentage: 10, color: "#AA8345" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Child Switcher */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-1">
        {family?.members?.filter(m => m.role !== 'Parent').map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedChild(m.id)}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-2xl border transition-all
              ${selectedChild === m.id
                ? 'bg-white border-[#39765C] shadow-sm'
                : 'bg-white/60 border-[#E7EBE5] hover:bg-white text-[#748078]'
              }
            `}
          >
            <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
            <div className="text-left">
              <p className="text-xs font-bold text-[#21352D]">{m.name}</p>
              <p className="text-[10px] text-[#748078]">Limit: {Math.floor(m.dailyLimitMinutes / 60)}h / day</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Daily Allowance & Category Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Daily Limit Progress Card */}
          <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-[#21352D]">
                  Daily Limit for {child?.name}
                </h3>
                <p className="text-xs text-[#748078]">
                  Enforced on {childDevice?.name || "All assigned devices"}
                </p>
              </div>

              {/* Bonus time buttons */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-[#748078] mr-1 hidden sm:inline">Add time:</span>
                <button
                  onClick={() => childDevice && onGrantBonusTime(childDevice.id, 15)}
                  className="px-2.5 py-1.5 bg-[#EDF4EE] hover:bg-[#d8e6db] text-[#39765C] text-xs font-bold rounded-xl transition-colors"
                >
                  +15m
                </button>
                <button
                  onClick={() => childDevice && onGrantBonusTime(childDevice.id, 30)}
                  className="px-2.5 py-1.5 bg-[#EDF4EE] hover:bg-[#d8e6db] text-[#39765C] text-xs font-bold rounded-xl transition-colors"
                >
                  +30m
                </button>
                <button
                  onClick={() => childDevice && onGrantBonusTime(childDevice.id, 60)}
                  className="px-2.5 py-1.5 bg-[#39765C] hover:bg-[#2e614c] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  +1 Hour
                </button>
              </div>
            </div>

            {/* Giant Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#21352D]">
                  {Math.floor((child?.usedMinutes || 105) / 60)}h {(child?.usedMinutes || 105) % 60}m used today
                </span>
                <span className="font-semibold text-[#748078]">
                  {Math.max(0, (child?.dailyLimitMinutes || 120) - (child?.usedMinutes || 105))}m remaining
                </span>
              </div>
              <div className="w-full h-3.5 bg-[#EDEFE9] rounded-full overflow-hidden flex">
                <div 
                  className="bg-[#39765C] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round(((child?.usedMinutes || 105) / (child?.dailyLimitMinutes || 120)) * 100))}%` }}
                />
              </div>
            </div>

            {/* Category Breakdown */}
            <h4 className="text-xs font-bold text-[#748078] uppercase tracking-wider mb-4">
              Category Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <div key={i} className="p-3.5 bg-[#F6F7F5] rounded-xl border border-[#E7EBE5] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                    <div>
                      <p className="text-xs font-bold text-[#21352D]">{cat.name}</p>
                      <p className="text-[11px] text-[#748078]">{cat.percentage}% of total screen time</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#21352D]">
                    {Math.floor(cat.minutes / 60)}h {cat.minutes % 60}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule & Downtime Rules */}
          <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#21352D] mb-4">
              Downtime & Bedtime Schedule
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-[#F6F7F5] rounded-xl border border-[#E7EBE5] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#21352D]">School Nights (Sunday – Thursday)</p>
                  <p className="text-xs text-[#748078]">Bedtime lockdown from 8:30 PM to 7:00 AM</p>
                </div>
                <span className="text-xs font-bold text-[#39765C] bg-[#EDF4EE] px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
              <div className="p-4 bg-[#F6F7F5] rounded-xl border border-[#E7EBE5] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#21352D]">Weekend Nights (Friday – Saturday)</p>
                  <p className="text-xs text-[#748078]">Bedtime lockdown from 10:00 PM to 8:00 AM</p>
                </div>
                <span className="text-xs font-bold text-[#39765C] bg-[#EDF4EE] px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Quick Insights & Health Advice */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#EDF4EE] border border-[#D5E4D8] rounded-[22px] p-6 shadow-xs">
            <div className="flex items-center space-x-2 text-[#39765C] mb-3">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold">Kinly Health Insights</h3>
            </div>
            <p className="text-xs text-[#21352D] leading-relaxed mb-3">
              Leo’s screen time has decreased by <span className="font-bold text-[#39765C]">24%</span> this week, with over 37% focused on educational apps like Duolingo Kids.
            </p>
            <div className="p-3 bg-white/80 rounded-xl text-xs text-[#748078]">
              💡 <strong>Pediatric Tip:</strong> Enforcing 30 minutes of screen-free winding down before 8:30 PM significantly improves REM sleep quality in 9-year-olds.
            </div>
          </div>

          <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
            <h4 className="text-xs font-bold text-[#748078] uppercase tracking-wider mb-4">
              Top Used Apps Today
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#21352D]">Duolingo Kids</span>
                <span className="text-[#748078]">42 mins</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#21352D]">YouTube Kids</span>
                <span className="text-[#748078]">35 mins</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#21352D]">Minecraft</span>
                <span className="text-[#748078]">28 mins</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
