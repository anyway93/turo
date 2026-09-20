import type { Metadata } from "next";
import { CreateTourForm } from "@/components/tours/create-tour";

export const metadata: Metadata = {
  title: "Создать тур — Turo",
};

export default function CreatePage() {
  return (
    <main>
      <CreateTourForm />
    </main>
  );
}
