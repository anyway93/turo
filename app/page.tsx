import { Wrapper } from "@/components/layout/wrapper";
import {
  CtaBand,
  HeroSlider,
  MediaCard,
  MediaCardGroup,
  PlaceCard,
  PlaceCardGroup,
  Section,
  Step,
  StepGroup,
} from "@/components/widgets";
import { paths, places, steps } from "@/components/home/content";

export default function Home() {
  return (
    <main>
      <HeroSlider />

      <Wrapper>
        <Section
          id="tours"
          label="Платформа"
          title="Два пути в одну дорогу"
          text="Можно выбрать готовый маршрут. Можно собрать свой и открыть его для других. Без каталожного шума — только место, даты и люди."
          aside={[
            { index: "01", label: "гость" },
            { index: "02", label: "автор" },
          ]}
        >
          <MediaCardGroup>
            {paths.map((path) => (
              <MediaCard key={path.index} {...path} />
            ))}
          </MediaCardGroup>
        </Section>

        <Section id="how" label="Процесс" title="Три спокойных шага">
          <StepGroup>
            {steps.map((step) => (
              <Step key={step.index} {...step} />
            ))}
          </StepGroup>
        </Section>

        <Section
          id="places"
          label="Направления"
          title="Куда уезжают чаще"
          text="Не реклама стран — живые сборы людей. Карточки ниже ведут в каталог."
        >
          <PlaceCardGroup>
            {places.map((place, index) => (
              <PlaceCard
                key={place.name}
                href="#tours"
                featured={index === 0}
                {...place}
              />
            ))}
          </PlaceCardGroup>
        </Section>

        <CtaBand
          id="auth"
          title="Войти и поехать"
          text="Регистрация нужна и чтобы записаться, и чтобы опубликовать свой маршрут. Никакого шума в ленте — только ваши поездки."
          actions={[
            { label: "Создать аккаунт", variant: "cta" },
            { label: "У меня уже есть", variant: "outline" },
          ]}
        />
      </Wrapper>
    </main>
  );
}
