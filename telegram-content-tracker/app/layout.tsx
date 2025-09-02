import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Контент-трекер для запусков",
  description: "Простой трекер контента и калькулятор подписчиков для Telegram-запусков",
  applicationName: "Контент-трекер",
  themeColor: "#0b1220",
  icons: [{ rel: "icon", url: "/icon-192.png" }, { rel: "apple-touch-icon", url: "/icon-192.png" }],
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Контент-трекер" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ru" className="dark"><body>{children}</body></html>);
}