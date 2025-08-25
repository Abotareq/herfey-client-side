"use client";

import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [storeId , setStoreId] = useState(null);
  const [customerStoreId , setCustomerStoreId] = useState(null);
  return (
    <StoreContext.Provider
      value={{ storeId, customerStoreId, setStoreId, setCustomerStoreId }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext must StoreProvider");
  }
  return context;
}
