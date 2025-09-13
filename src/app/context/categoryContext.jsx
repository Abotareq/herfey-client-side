"use client";

import { createContext, useContext, useState } from "react";

const categoryContext = createContext();

export function CategoryProvider({ children }) {
  const [category , setCategory] = useState(null);

  return (
    <categoryContext.Provider
      value={{ category, setCategory }}
    >
      {children}
    </categoryContext.Provider>
  );
}

export function useCategoryContext() {
  const context = useContext(categoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used within a CategoryProvider");
  }
  return context;
}
