import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";

export default function Home() {
  return (
    <main className="home">
      <div className="home__glow home__glow_cta" />
      <div className="home__glow home__glow_ocean" />
      <Title variant={12} color="primary">
        Turo
      </Title>
      <Title variant={60}>Путешествия с цветом моря и теплом заката</Title>
      <Text variant={20} color="muted">
        Библиотека интерфейса и готовые блоки для сайта туров — на витрине.
      </Text>
      <Button asChild size="xl" variant="cta">
        <Link href="/ui">Открыть UI-витрину</Link>
      </Button>
    </main>
  );
}
