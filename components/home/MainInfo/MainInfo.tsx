import "./MainInfo.scss";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { Step, StepGroup } from "@/components/widgets/step";
import { steps } from "@/components/home/content";

export function MainInfo() {
  return (
    <section className="main-info" id="how">
      <header className="main-info__head">
        <Eyebrow>Процесс</Eyebrow>
        <h2 className="main-info__title">Три спокойных шага</h2>
      </header>
      <StepGroup>
        {steps.map((step) => (
          <Step key={step.index} {...step} />
        ))}
      </StepGroup>
    </section>
  );
}
