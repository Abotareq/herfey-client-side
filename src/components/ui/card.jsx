// components/ui/card.js
import React from "react";
import { cn } from "@/lib/utils"; // optional helper for merging classes

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white text-gray-900 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div className={cn("p-4 border-b", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("p-4", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }) {
  return (
    <div className={cn("p-4 border-t", className)} {...props} />
  );
}
