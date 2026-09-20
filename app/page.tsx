import { Wrapper } from "@/components/layout/wrapper";
import { HeroSlider } from "@/components/home/hero-slider";
import { MainAbout } from "@/components/home/MainAbout";
import { MainInfo } from "@/components/home/MainInfo";
import { MainPlaces } from "@/components/home/MainPlaces";
import { MainTours } from "@/components/home/MainTours";
import { MainAuth } from "@/components/home/MainAuth";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <Wrapper>
        <MainAbout />
        <MainTours />
        <MainInfo />
        <MainPlaces />
        <MainAuth />
      </Wrapper>
    </main>
  );
}
