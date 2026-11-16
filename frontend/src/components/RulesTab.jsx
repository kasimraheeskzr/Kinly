import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Globe, 
  CheckCircle, 
  Lock,
  Search,
  AlertTriangle
} from 'lucide-react';

export default function RulesTab({ contentRules, onUpdateRules }) {
  const [newBlocked, setNewBlocked] = useState('');
  const [newAllowed, setNewAllowed] = useState('');

  const categories = contentRules?.categories || [
    { id: "cat_adult", name: "Adult & Explicit Content", blocked: true, strict: true },
    { id: "cat_gambling", name: "Gambling & Betting", blocked: true, strict: true },
    { id: "cat_violence", name: "Violence & Graphic Material", blocked: true, strict: true },
    { id: "cat_social", name: "Social Networks (Under 13)", blocked: true, strict: false },
    { id: "cat_gaming", name: "Online Gaming Hubs", blocked: false, strict: false },
    { id: "cat_shopping", name: "In-App Purchases & Stores", blocked: true, strict: false }
  ];

  const handleToggleCategory = (catId) => {
    const updated = categories.map(c => c.id === catId ? { ...c, blocked: !c.blocked } : c);
    onUpdateRules({ ...contentRules, categories: updated });
  };

  const handleAddBlocked = (e) => {
    e.preventDefault();
    if (!newBlocked.trim()) return;
    const cleanUrl = newBlocked.trim().toLowerCase().replace(/^https?:\/\//, '');
    const current = contentRules?.blockedWebsites || [];
    if (!current.includes(cleanUrl)) {
      onUpdateRules({ ...contentRules, blockedWebsites: [...current, cleanUrl] });
    }
    setNewBlocked('');
  };

  const handleRemoveBlocked = (domain) => {
    const current = contentRules?.blockedWebsites || [];
    onUpdateRules({ ...contentRules, blockedWebsites: current.filter(d => d !== domain) });
  };

  const handleAddAllowed = (e) => {
    e.preventDefault();
    if (!newAllowed.trim()) return;
    const cleanUrl = newAllowed.trim().toLowerCase().replace(/^https?:\/\//, '');
    const current = contentRules?.allowedWebsites || [];
    if (!current.includes(cleanUrl)) {
      onUpdateRules({ ...contentRules, allowedWebsites: [...current, cleanUrl] });
    }
    setNewAllowed('');
  };

  const handleRemoveAllowed = (domain) => {
    const current = contentRules?.allowedWebsites || [];
    onUpdateRules({ ...contentRules, allowedWebsites: current.filter(d => d !== domain) });
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-[22px] border border-[#E7EBE5] shadow-xs">
        <h2 className="text-lg font-bold text-[#21352D]">Content Filtering & Family Protection Rules</h2>
        <p className="text-xs text-[#748078]">
          Automated web inspection, category blocking, and explicit search prevention
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Category Filters */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#21352D]">Automated Category Filters</h3>
              <span className="text-[10px] font-bold text-[#39765C] bg-[#EDF4EE] px-2 py-0.5 rounded-md">
                AI Filter
              </span>
            </div>

            <div className="space-y-3">
              {categories.map((cat) => (
                <div 
                  key={cat.id}
                  className="flex items-center justify-between p-3.5 bg-[#F6F7F5] rounded-xl border border-[#E7EBE5]"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      cat.blocked ? 'bg-[#BD725E]/10 text-[#BD725E]' : 'bg-[#EDF3E8] text-[#71874D]'
                    }`}>
                      {cat.blocked ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#21352D]">{cat.name}</p>
                      <p className="text-[10px] text-[#748078]">
                        {cat.blocked ? 'Access strictly blocked' : 'Access allowed with monitoring'}
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cat.blocked}
                      onChange={() => handleToggleCategory(cat.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-[#D9DFD7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39765C]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Blocked & Whitelisted Domains */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Blocked Websites */}
          <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#21352D] mb-1">Custom Blocked Websites</h3>
            <p className="text-xs text-[#748078] mb-4">Specific URLs or domains blocked across all children's devices</p>

            {/* Input form */}
            <form onSubmit={handleAddBlocked} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. reddit.com or twitch.tv"
                value={newBlocked}
                onChange={(e) => setNewBlocked(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-[#F6F7F5] border border-[#E7EBE5] rounded-xl outline-none focus:border-[#39765C] text-[#21352D]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#BD725E] hover:bg-[#a65f4d] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Block URL
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {contentRules?.blockedWebsites?.map((site) => (
                <div key={site} className="flex items-center justify-between px-3 py-2 bg-[#F9ECE7] rounded-xl text-xs">
                  <span className="font-mono text-[#BD725E] font-medium">{site}</span>
                  <button 
                    onClick={() => handleRemoveBlocked(site)}
                    className="p-1 text-[#BD725E] hover:text-red-700"
                    title="Remove rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Allowed Websites (Always accessible) */}
          <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#21352D] mb-1">Always-Allowed Educational Sites</h3>
            <p className="text-xs text-[#748078] mb-4">Websites that bypass downtime and limits for homework</p>

            <form onSubmit={handleAddAllowed} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. google.classroom or duolingo.com"
                value={newAllowed}
                onChange={(e) => setNewAllowed(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-[#F6F7F5] border border-[#E7EBE5] rounded-xl outline-none focus:border-[#39765C] text-[#21352D]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#39765C] hover:bg-[#2e614c] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Allow
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {contentRules?.allowedWebsites?.map((site) => (
                <div key={site} className="flex items-center justify-between px-3 py-2 bg-[#EDF3E8] rounded-xl text-xs">
                  <span className="font-mono text-[#71874D] font-medium">{site}</span>
                  <button 
                    onClick={() => handleRemoveAllowed(site)}
                    className="p-1 text-[#71874D] hover:text-green-800"
                    title="Remove rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
