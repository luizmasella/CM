// FILE: src/components/Toast.tsx
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
      className={`${config.bgColor} ${config.textColor} rounded-lg shadow-xl p-4 mb-3 flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in`}
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
