"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");

  const value = useMemo(() => ({
    showToast: (nextMessage: string) => {
      setMessage(nextMessage);
      window.setTimeout(() => setMessage(""), 2600);
    }
  }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message ? <div className="site-toast">{message}</div> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
