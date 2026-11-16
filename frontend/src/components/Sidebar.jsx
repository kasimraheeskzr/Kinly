import React from 'react';
import { 
  LayoutGrid, 
  Clock, 
  Smartphone, 
  ShieldCheck, 
  Sliders, 
  CreditCard, 
  QrCode, 
  LogOut, 
  ChevronRight,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenCheckout, onOpenPairing, family, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid, count: null },
    { id: 'screentime', label: 'Screen time', icon: Clock, count: null },
    { id: 'devices', label: 'Devices', icon: Smartphone, count: family?.members?.reduce((acc, m) => acc + (m.devicesCount || 0), 0) || 4 },
    { id: 'rules', label: 'Rules & Limits', icon: Sliders, count: null },
    { id: 'billing', label: 'Subscription', icon: CreditCard, count: 'Plus' },
    { id: 'phone', label: 'Connect Phone', icon: QrCode, count: 'New' }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-[#E7EBE5] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header / Logo */}
        <div className="p-6 pb-2">
          <div className="flex items-center space-x-3 mb-6">
            {/* Kinly Logo matching Figma SVG */}
            <div className="w-[38px] h-[38px] rounded-[10px] bg-[#39765C] flex items-center justify-center shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#21352D] tracking-tight flex items-center">
                Kinly
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-[#EDF4EE] text-[#39765C] rounded-md">PRO</span>
              </h1>
              <p className="text-xs text-[#748078] font-medium">Allied Healthcare & Safety</p>
            </div>
          </div>

          <div className="px-2 mb-2">
            <span className="text-[11px] font-bold text-[#748078] tracking-wider uppercase">
              Family Space
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setIsMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    ${isActive 
                      ? 'bg-[#EDF4EE] text-[#39765C] font-semibold shadow-xs' 
                      : 'text-[#748078] hover:text-[#21352D] hover:bg-[#F6F7F5]'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#39765C]' : 'text-[#748078]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive 
                        ? 'bg-[#39765C] text-white' 
                        : 'bg-[#F0F2EE] text-[#748078]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Promo Upgrade Card & Admin User Profile */}
        <div className="p-4 space-y-4">
          {/* Promo Card matching Figma SVG rx=14 fill=#F4F5EB */}
          <div className="bg-[#F4F5EB] border border-[#E9EBDC] rounded-2xl p-4 relative overflow-hidden shadow-xs">
            <div className="flex items-start justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#39765C]/10 flex items-center justify-center text-[#39765C]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#39765C] bg-[#39765C]/10 px-2 py-0.5 rounded-full">
                All-in-One
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#21352D] mb-1">Kinly Family Plus</h4>
            <p className="text-xs text-[#748078] leading-relaxed mb-3">
              Unlock unlimited phone sync, AI filters, and GPS geo-fence tracking.
            </p>
            <button
              onClick={onOpenCheckout}
              className="w-full py-2 bg-white hover:bg-[#EDF4EE] text-[#39765C] border border-[#39765C]/20 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Upgrade Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Profile matching Figma footer */}
          <div className="pt-2 border-t border-[#E7EBE5] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={family?.admin?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
                alt="Sarah Miller"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#EDF4EE]"
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-[#21352D] leading-tight">
                  {family?.admin?.name || "Sarah Miller"}
                </p>
                <p className="text-xs text-[#748078]">
                  {family?.admin?.role || "Family Admin"}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('billing')}
              title="Settings & Billing"
              className="p-1.5 text-[#748078] hover:text-[#21352D] hover:bg-[#F6F7F5] rounded-lg transition-colors"
            >
              <CreditCard className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
