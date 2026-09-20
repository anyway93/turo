import type { Metadata } from "next";
import { PageHero } from "@/components/widgets/page-hero";
import { Wrapper } from "@/components/layout/wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
import { termsSections } from "@/data";
import { faqItems } from "@/data/content/faq";
import "./terms.scss";

export const metadata: Metadata = {
  title: "Пользовательское соглашение — Turo",
};

export default function TermsPage() {
  return (
    <main className="terms-page">
      <PageHero
        kicker="Документы"
        title="Пользовательское соглашение"
        text="Коротко и по делу: кто за что отвечает, как устроены оплата, отмена и личный чат с гидом."
      />
      <Wrapper>
        <ol className="terms-page__list">
          {termsSections.map((section) => (
            <li key={section.id}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </li>
          ))}
        </ol>
        <h2 className="terms-page__faq-title">Частые вопросы</h2>
        <Accordion type="single" collapsible>
          {faqItems.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Wrapper>
    </main>
  );
}
