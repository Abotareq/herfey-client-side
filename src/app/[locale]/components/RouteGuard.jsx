// components/RouteGuard.tsx
"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import SkeletonLoader from "./SkeltonLoader";
import LoadingSpinner from "./ReusableComponents/LoadingSpinner/LoadingSpinner";

export function RouteGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("RouteGuard - Current state:", {
      user,
      loading,
      pathname,
      userRole: user?.role,
    });

    if (loading) return;

    if (user) {
      console.log("User authenticated, role:", user.role);

      // Check if pathname ends with signin/signup (ignoring locale)
      if (pathname.endsWith("/signin") || pathname.endsWith("/signup")) {
        console.log("Redirecting authenticated user away from auth pages");
        router.push("/");
        return;
      }

     if (user.role === "VENDOR") {
        // Check if user is not already in vendor-profile or its nested routes
        if (!pathname.includes("/vendor-profile")) {
          console.log(
            "Redirecting VENDOR to vendor-profile (not in vendor section)"
          );
          router.push("/vendor-profile");
          return;
        }
      }

      if (user.role === "CUSTOMER") {
        if (pathname.endsWith("/vendor-profile")) {
          console.log(
            "Redirecting CUSTOMER from vendor-profile to customer-profile"
          );
          router.push("/customer-profile");
          return;
        }
      }
    } else {
      console.log("No user authenticated");

      if (
        pathname.endsWith("/customer-profile") ||
        pathname.endsWith("/vendor-profile")
      ) {
        console.log("Redirecting unauthenticated user to home");
        router.push("/");
        return;
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  return children;
}
