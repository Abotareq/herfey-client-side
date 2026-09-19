import {
  Fraunces,
  Plus_Jakarta_Sans,
  Amiri,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import NotFound from "./not-found";
import { Providers } from "./client/queryClientProivder";
import { AuthProvider } from "../context/AuthContext";
import ConditionalLayout from "./components/ConditionalLayout ";
import { RouteGuard } from "./components/RouteGuard";
import { Toaster } from "react-hot-toast";
import { StoreProvider } from "../context/StoreContext";
import { CheckoutProvider } from "../context/CheckoutContext";
import { FavouriteContext } from "../context/FavouriteContext";
import { CategoryProvider } from "../context/categoryContext";

// Type: a serif with character for display, a quiet grotesk for reading.
// Each has an Arabic partner; the CSS stacks fall through per glyph, so a
// mixed line (e.g. "EGP 1,200" inside Arabic copy) still reads as one voice.
const displaySans = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz", "SOFT"],
});

const bodySans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: "variable",
});

const displayArabic = Amiri({
  variable: "--font-display-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const bodyArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-body-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Herafy",
  description:
    "Handmade in Egypt. Pottery, jewelry, textiles, woodwork, leather and glass, straight from the workshops that make them.",
  icons: {
    icon: "/1.11.svg",
  },
};

export default async function RootLayout({ params, children }) {
  const resolvedParams = await params;

  if (!hasLocale(routing.locales, resolvedParams.locale)) {
    return <NotFound />;
  }

  const messages = await getMessages();

  return (
    <html
      lang={resolvedParams.locale}
      dir={resolvedParams.locale === "ar" ? "rtl" : "ltr"}
      className={`${displaySans.variable} ${bodySans.variable} ${displayArabic.variable} ${bodyArabic.variable}`}
    >
      <body>
        <NextIntlClientProvider
          locale={resolvedParams.locale}
          messages={messages}
        >
          <Providers>
            <AuthProvider>
              <StoreProvider>
                <CategoryProvider>
                  <CheckoutProvider>
                    <RouteGuard>
                      <FavouriteContext>
                        <Toaster
                          position={"top-right"}
                          toastOptions={{
                            success: {
                              duration: 3000,
                            },
                            error: {
                              duration: 5000,
                            },
                          }}
                        />
                        <ConditionalLayout locale={resolvedParams.locale}>
                          {children}
                        </ConditionalLayout>
                      </FavouriteContext>
                    </RouteGuard>
                  </CheckoutProvider>
                </CategoryProvider>
              </StoreProvider>
            </AuthProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
