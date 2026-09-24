import type { Metadata } from "next";
import { ApiMap } from "@/components/dev/api-map";

export const metadata: Metadata = {
  title: "Запросы API — Turo",
  description: "Адреса, тела и ответы бэкенда Turo для подключения фронта.",
};

export default function ApiMapPage() {
  return <ApiMap />;
}
