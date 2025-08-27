"use client";
import { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [state, setState] = useState({
    useExisting: true,   // true
    newAddress: null,    // 
  });
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const setUseExisting = (v) => {
    setState((prev) => ({
      ...prev,
      useExisting: v,
      newAddress: v ? null : prev.newAddress,
    }));
  };

  const setNewAddress = (addr) => {
    setState((prev) => ({
      ...prev,
      newAddress: addr,
      useExisting: addr ? false : prev.useExisting,
    }));
  };

  const resetCheckout = () => {
    setState({ useExisting: true, newAddress: null });
  };

  return (
    <CheckoutContext.Provider
      value={{ state, setUseExisting, setNewAddress, resetCheckout, paymentMethod, setPaymentMethod }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return ctx;
}
