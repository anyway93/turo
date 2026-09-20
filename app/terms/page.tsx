import type { Metadata } from "next";
import { TermsView } from "@/components/terms/terms-view/terms-view";
import { termsMeta } from "@/data";
import "./terms.scss";

export const metadata: Metadata = {
  title: "Пользовательское соглашение — Turo",
  description: `Публичная оферта ООО «Туро Тревел». Редакция ${termsMeta.version} от ${termsMeta.effective}.`,
};

export default function TermsPage() {
  return <TermsView />;
}
