import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-24 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-glass border backdrop-blur-md animate-in slide-in-from-right-10 fade-in duration-300 min-w-[300px]
                            ${toast.type === 'success' ? 'bg-white/90 border-green-100 text-slate-800' : ''}
                            ${toast.type === 'error' ? 'bg-red-50/90 border-red-100 text-red-800' : ''}
                            ${toast.type === 'info' ? 'bg-blue-50/90 border-blue-100 text-blue-800' : ''}
                        `}
                    >
                        {toast.type === 'success' && <CheckCircle2 size={20} className="text-green-500" />}
                        {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
                        {toast.type === 'info' && <Info size={20} className="text-blue-500" />}

                        <p className="flex-1 text-sm font-medium">{toast.message}</p>

                        <button onClick={() => removeToast(toast.id)} className="text-current opacity-50 hover:opacity-100">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
