import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";

export default function Home() {
  return (
    <main className="relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-cta/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12%] left-[-8%] h-[380px] w-[380px] rounded-full bg-primary/12 blur-3xl" />
      <Title variant={12} color="primary" className="mb-4">
        Turo
      </Title>
      <Title variant={60} className="max-w-2xl">
        Путешествия с цветом моря и теплом заката
      </Title>
      <Text variant={20} color="muted" className="mt-5 max-w-lg">
        Библиотека интерфейса и готовые блоки для сайта туров — на витрине.
      </Text>
      <Button asChild size="xl" variant="cta" className="mt-8">
        <Link href="/ui">Открыть UI-витрину</Link>
      </Button>
    </main>
  );
}
