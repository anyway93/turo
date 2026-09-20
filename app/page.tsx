import { Wrapper } from "@/components/layout/wrapper";
import { HeroSlider } from "@/components/home/hero-slider";
import { MainAbout } from "@/components/home/MainAbout";
import { MainInfo } from "@/components/home/MainInfo";
import { MainPlaces } from "@/components/home/MainPlaces";
import { MainAuth } from "@/components/home/MainAuth";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <Wrapper>
        <MainAbout />
        <MainInfo />
        <MainPlaces />
        <MainAuth />
      </Wrapper>
    </main>
  );
}
