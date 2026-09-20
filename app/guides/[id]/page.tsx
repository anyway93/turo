import type { Metadata } from "next";
import { organizers } from "@/data/users/organizers";
import { GuideProfile } from "@/components/guides/guide-profile";

export function generateStaticParams() {
  return organizers.map((user) => ({ id: user.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const guide = organizers.find((item) => item.id === id);
  return { title: guide ? `${guide.name} — Turo` : "Гид — Turo" };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main>
      <GuideProfile id={id} />
    </main>
  );
}
