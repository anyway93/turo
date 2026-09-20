import "./MainTours.scss";
import Link from "next/link";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { Button } from "@/components/ui";
import { TourCard } from "@/components/tours/tour-card";
import { tours } from "@/data";

export function MainTours() {
  return (
    <section className="main-tours" id="tours">
      <header>
        <Eyebrow>Каталог</Eyebrow>
        <h2>Ближайшие наборы</h2>
        <p>Живые даты, места и цена. Дальше — фильтры по миру.</p>
      </header>
      <div className="main-tours__grid">
        {tours.slice(0, 6).map((tour, index) => (
          <TourCard key={tour.slug} tour={tour} index={index} />
        ))}
      </div>
      <Button asChild variant="outline" size="lg">
        <Link href="/tours/">Все туры</Link>
      </Button>
    </section>
  );
}
