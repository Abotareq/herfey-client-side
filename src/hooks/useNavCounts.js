"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useMyCart, getGuestCartCount, GUEST_CART_EVENT } from "@/service/cart";
import { useGetUserWishlistById } from "@/service/user";

/**
 * Line-item count for the navbar cart badge. Signed-in users read the
 * server cart; guests read localStorage and re-read whenever a guest-cart
 * helper announces a write (same tab) or another tab changes it (storage).
 */
export function useCartCount() {
  const { user } = useAuth();
  const { data: cart } = useMyCart({ enabled: !!user });

  const [guestCount, setGuestCount] = useState(0);
  useEffect(() => {
    if (user) return;
    const read = () => setGuestCount(getGuestCartCount());
    read();
    window.addEventListener(GUEST_CART_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(GUEST_CART_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, [user]);

  if (user) return cart?.items?.length ?? 0;
  return guestCount;
}

/** Wishlist size for the navbar heart. Guests have no wishlist. */
export function useWishlistCount() {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const { data } = useGetUserWishlistById(userId);
  return data?.data?.user?.wishlist?.length ?? 0;
}
