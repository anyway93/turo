import type { Metadata } from "next";
import { ToursCatalog } from "@/components/tours/tours-catalog";

export const metadata: Metadata = {
  title: "Каталог туров — Turo",
  description: "Авторские маршруты по миру: даты, места, цена, отзывы.",
};

export default function ToursPage() {
  return (
    <main>
      <ToursCatalog />
    </main>
  );
}
