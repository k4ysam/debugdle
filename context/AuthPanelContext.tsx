"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthPanelContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AuthPanelContext = createContext<AuthPanelContextValue>({
  open: false,
  setOpen: () => {},
});

export function AuthPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <AuthPanelContext.Provider value={{ open, setOpen }}>
      {children}
    </AuthPanelContext.Provider>
  );
}

export function useAuthPanel() {
  return useContext(AuthPanelContext);
}
