import type { Regium } from "@regium/core";
import { type ReactNode, createContext, useContext } from "react";

const RegiumContext = createContext<Regium | null>(null);

export interface RegiumProviderProps {
  regium: Regium;
  children: ReactNode;
}

export function RegiumProvider(props: RegiumProviderProps) {
  return <RegiumContext.Provider value={props.regium}>{props.children}</RegiumContext.Provider>;
}

export function useRegium(): Regium {
  const ctx = useContext(RegiumContext);
  if (!ctx) {
    throw new Error("useRegium must be used inside a <RegiumProvider>");
  }
  return ctx;
}
