"use client";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * "Cancel this order?" as a dialog instead of window.confirm. The trigger
 * is whatever button the page already had; the confirm action calls
 * `onConfirm`. Keeping the order is the safe, default-focused choice.
 */
export default function CancelOrderDialog({ onConfirm, disabled, children }) {
  const t = useTranslations("orders");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-0 shadow-xl sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl text-gray-900">
            {t("cancelOrder")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {t("areYouSure")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="btn btn-secondary h-auto border-0">
            {t("noKeep")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="btn h-auto bg-red-700 text-white shadow-md shadow-red-900/15 hover:bg-red-800"
          >
            {disabled && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {t("yesCancel")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
