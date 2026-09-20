"use client";
import "./MainInfo.scss";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { Step, StepGroup } from "@/components/widgets/step";
import { steps } from "@/components/home/content";
import { useLocale } from "@/lib/locale";

export function MainInfo() {
  const { t } = useLocale();
  return (
    <section className="main-info" id="how">
      <header className="main-info__head">
        <Eyebrow>{t("home.infoKicker")}</Eyebrow>
        <h2 className="main-info__title">{t("home.infoTitle")}</h2>
      </header>
      <StepGroup>
        {steps.map((step) => (
          <Step
            key={step.index}
            index={step.index}
            title={t(`step.s${step.index.replace(/^0/, "")}t`)}
            text={t(`step.s${step.index.replace(/^0/, "")}d`)}
          />
        ))}
      </StepGroup>
    </section>
  );
}
