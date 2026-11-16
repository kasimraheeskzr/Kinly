import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function NotificationToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-3 bg-[#21352D] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200 max-w-sm">
      {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#71874D] shrink-0" />}
      {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#AA8345] shrink-0" />}
      {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-[#BD725E] shrink-0" />}
      {(!toast.type || toast.type === 'info') && <Info className="w-5 h-5 text-[#39765C] shrink-0" />}
      
      <p className="text-xs font-semibold flex-1 leading-snug">
        {toast.message}
      </p>

      <button onClick={onClose} className="text-white/60 hover:text-white p-0.5">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
