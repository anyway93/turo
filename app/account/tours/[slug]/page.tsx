import type { Metadata } from "next";
import { TourEditor } from "@/components/account/tour-editor";

export const metadata: Metadata = { title: "Редактирование тура — Turo" };

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main>
      <TourEditor slug={slug} />
    </main>
  );
}
