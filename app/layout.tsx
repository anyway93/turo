import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { Providers } from "./providers";
import "../styles/index.scss";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Turo — туры от людей и для людей",
  description:
    "Выбирайте авторские маршруты или создайте свой тур. Бронирование без лишнего шума.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" suppressHydrationWarning className={onest.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
