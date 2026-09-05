'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-[#1E8E3E]" />,
  error: <XCircle className="w-5 h-5 text-[#D62828]" />,
  warning: <AlertTriangle className="w-5 h-5 text-[#E08A00]" />,
  info: <Info className="w-5 h-5 text-[#2B3A55]" />,
};

const ToastItem = ({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="relative flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-lg border w-full max-w-sm pointer-events-auto overflow-hidden"
    >
      {icons[toast.type]}
      <p className="text-sm font-medium text-[#111] flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 3, ease: 'linear' }}
        className={cn(
          "absolute bottom-0 left-0 h-1",
          toast.type === 'success' && 'bg-[#1E8E3E]',
          toast.type === 'error' && 'bg-[#D62828]',
          toast.type === 'warning' && 'bg-[#E08A00]',
          toast.type === 'info' && 'bg-[#2B3A55]'
        )}
      />
    </motion.div>
  );
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toast = React.useCallback((message: string, type: ToastType = 'info') => {
    setToasts(prev => [...prev, { id: Math.random().toString(36).slice(2), message, type }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted && createPortal(
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
          <AnimatePresence>
            {toasts.map(t => (
              <ToastItem key={t.id} toast={t} onRemove={removeToast} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
