"use client";
import { useEffect, useRef, useState } from "react";
import { useMutationState } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

/**
 * One place that says "something is happening" for every write in the app:
 * removing a cart item, cancelling an order, applying a coupon, updating a
 * status. It reads React Query's pending mutations, so nothing has to opt
 * in beyond giving the mutation a `meta.activity` key from the `activity`
 * messages ("removingItem", "cancellingOrder", ...). Unlabelled mutations
 * fall back to "Working…".
 *
 * Fast writes never show it (it waits 200ms), and once it is on screen it
 * stays for at least 600ms so it never flashes.
 */
export default function ActivityIndicator() {
  const t = useTranslations("activity");

  const pending = useMutationState({
    filters: { status: "pending" },
    select: (mutation) => mutation.options.meta?.activity ?? "working",
  });
  const active = pending.length > 0;
  // The most recent write is the one the user just did
  const label = active ? pending[pending.length - 1] : null;

  const visible = useSettledFlag(active, { showAfter: 200, minVisible: 600 });
  // Keep the last label through the minimum-visible tail
  const shown = useRef(label);
  if (label) shown.current = label;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {visible && (
        <div className="enter inline-flex items-center gap-2.5 rounded-full bg-gray-900 py-2.5 pe-4 ps-3.5 text-sm font-medium text-white shadow-lg shadow-gray-900/20">
          <Loader2 className="h-4 w-4 animate-spin text-orange-400" aria-hidden="true" />
          {t(shown.current ?? "working")}
        </div>
      )}
    </div>
  );
}

/**
 * `flag`, debounced both ways: it turns on only after `showAfter` ms of
 * being true, and once on stays at least `minVisible` ms.
 */
function useSettledFlag(flag, { showAfter, minVisible }) {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    let timer;
    if (flag && !visible) {
      timer = setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, showAfter);
    } else if (!flag && visible) {
      const remaining = minVisible - (Date.now() - shownAt.current);
      timer = setTimeout(() => setVisible(false), Math.max(remaining, 0));
    }
    return () => clearTimeout(timer);
  }, [flag, visible, showAfter, minVisible]);

  return visible;
}
