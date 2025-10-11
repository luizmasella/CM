// FILE: src/components/Toast.tsx
// Sistema de notificações moderno

import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

export function Toast({ id, type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-500",
      textColor: "text-white",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-500",
      textColor: "text-white",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-500",
      textColor: "text-white",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.textColor} rounded-lg shadow-lg p-4 mb-3 flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in`}
    >
      <Icon size={24} className="flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// FILE: src/components/ToastContainer.tsx
import React from "react";
import { Toast } from "./Toast";

interface ToastData {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

// FILE: src/hooks/useToast.tsx
import { useState, useCallback } from "react";

interface ToastData {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (type: "success" | "error" | "warning" | "info", message: string) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, type, message }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message: string) => addToast("success", message),
    error: (message: string) => addToast("error", message),
    warning: (message: string) => addToast("warning", message),
    info: (message: string) => addToast("info", message),
  };

  return { toasts, removeToast, toast };
}
