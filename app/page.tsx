import "./page.scss";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSlider } from "@/components/home/hero-slider";
import { Button } from "@/components/ui";

const places = [
  {
    name: "Киото",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Марракеш",
    image:
      "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Лисий фьорд",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Home() {
  return (
    <div className="page">
      <Header />
      <main>
        <HeroSlider />

        <section className="home-section" id="tours">
          <div className="home-section__head">
            <div>
              <p className="home-section__label">Платформа</p>
              <h2 className="home-section__title">Два пути в одну дорогу</h2>
              <p className="home-section__text">
                Можно выбрать готовый маршрут. Можно собрать свой и открыть его
                для других. Без каталожного шума — только место, даты и люди.
              </p>
            </div>
            <p className="home-section__aside">
              <span>01</span> гость
              <span>02</span> автор
            </p>
          </div>
          <div className="paths">
            <Link href="#places" className="paths__card">
              <div className="paths__media">
                <Image
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <div className="paths__veil" />
              <div className="paths__dim" />
              <div className="paths__top">
                <span>01</span>
                <p className="paths__kicker">Путешественникам</p>
              </div>
              <div className="paths__body">
                <h3 className="paths__title">Найти тур</h3>
                <p className="paths__text">
                  Авторские маршруты с датами, ценой и свободными местами.
                  Запись в два шага.
                </p>
                <span className="paths__cta">
                  К каталогу
                  <ArrowUpRight />
                </span>
              </div>
            </Link>
            <Link href="#auth" className="paths__card" id="create">
              <div className="paths__media">
                <Image
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <div className="paths__veil" />
              <div className="paths__dim" />
              <div className="paths__top">
                <span>02</span>
                <p className="paths__kicker">Гидам</p>
              </div>
              <div className="paths__body">
                <h3 className="paths__title">Создать тур</h3>
                <p className="paths__text">
                  Опишите маршрут, поставьте цену и откройте набор. Turo — это
                  витрина, не посредник.
                </p>
                <span className="paths__cta paths__cta_accent">
                  Разместить
                  <ArrowUpRight />
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className="home-section" id="how">
          <p className="home-section__label">Процесс</p>
          <h2 className="home-section__title">Три спокойных шага</h2>
          <div className="steps">
            <article>
              <span>01</span>
              <h3>Регистрация</h3>
              <p>Один профиль — и как гость, и как автор маршрута.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Выбор или создание</h3>
              <p>Бронируйте чужой тур или опубликуйте свой на ближайшие даты.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Встреча</h3>
              <p>Подтверждение, чат с организатором и выезд без лишних писем.</p>
            </article>
          </div>
        </section>

        <section className="home-section" id="places">
          <p className="home-section__label">Направления</p>
          <h2 className="home-section__title">Куда уезжают чаще</h2>
          <p className="home-section__text">
            Не реклама стран — живые сборы людей. Карточки ниже ведут в каталог.
          </p>
          <div className="places">
            {places.map((place) => (
              <Link href="#tours" className="places__item" key={place.name}>
                <div className="places__media">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <span className="places__name">{place.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="auth" id="auth">
          <div>
            <h2>Войти и поехать</h2>
            <p>
              Регистрация нужна и чтобы записаться, и чтобы опубликовать свой
              маршрут. Никакого шума в ленте — только ваши поездки.
            </p>
          </div>
          <div className="auth__actions">
            <Button variant="cta" size="lg">
              Создать аккаунт
            </Button>
            <Button variant="outline" size="lg">
              У меня уже есть
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
