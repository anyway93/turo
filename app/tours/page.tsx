import type { Metadata } from "next";
import { PageHero } from "@/components/widgets/page-hero";
import { ToursCatalog } from "@/components/tours/tours-catalog";

export const metadata: Metadata = {
  title: "Каталог туров — Turo",
  description: "Авторские маршруты по миру: даты, места, цена, отзывы.",
};

export default function ToursPage() {
  return (
    <main>
      <PageHero
        kicker="Каталог"
        title="Туры по всему миру"
        text="Фильтры слева направо: поиск, город, регион, формат, сложность. Карточка ведёт к программе и оплате."
      />
      <ToursCatalog />
    </main>
  );
}
