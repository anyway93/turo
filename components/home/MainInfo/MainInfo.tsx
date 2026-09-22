"use client";
import "./MainInfo.scss";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { Step, StepGroup } from "@/components/widgets/step";
import { steps } from "@/components/home/content";
import { useLocale } from "@/lib/locale";
import { useTuro } from "@/lib/turo-store";

export function MainInfo() {
  const { t } = useLocale();
  const { user, ready } = useTuro();
  const prefix = ready && user ? `flow.${user.role}` : "step";
  return (
    <section className="main-info" id="how">
      <header className="main-info__head">
        <Eyebrow>{t("home.infoKicker")}</Eyebrow>
        <h2 className="main-info__title">{t("home.infoTitle")}</h2>
      </header>
      <StepGroup>
        {steps.map((step) => {
          const n = step.index.replace(/^0/, "");
          return (
            <Step
              key={step.index}
              index={step.index}
              title={t(`${prefix}.s${n}t`)}
              text={t(`${prefix}.s${n}d`)}
            />
          );
        })}
      </StepGroup>
    </section>
  );
}
