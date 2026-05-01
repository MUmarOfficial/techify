import { createContext } from "react";
import type { ToastMessage } from "../types";

export interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (type: ToastMessage["type"], message: string) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);
