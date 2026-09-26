import React from 'react';
import { useGym } from '../context/GymContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGym();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const borderColors = {
          success: 'border-primary/50 text-primary',
          error: 'border-error/50 text-error',
          warning: 'border-tertiary/50 text-tertiary',
          info: 'border-primary/30 text-primary'
        };

        const icons = {
          success: 'check_circle',
          error: 'error',
          warning: 'warning',
          info: 'info'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-surface-container-high/95 backdrop-blur-xl border ${borderColors[toast.type]} rounded-xl p-3.5 shadow-2xl flex items-start gap-3 transition-all animate-in slide-in-from-bottom-3 duration-200`}
          >
            <span className={`material-symbols-outlined text-[20px] ${borderColors[toast.type]} shrink-0 mt-0.5`}>
              {icons[toast.type]}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-on-surface">{toast.title}</div>
              <div className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
