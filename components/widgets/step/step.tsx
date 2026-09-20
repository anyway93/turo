import "./step.scss";
import type { ReactNode } from "react";

type StepProps = {
  index: string;
  title: string;
  text: string;
};

export function Step({ index, title, text }: StepProps) {
  return (
    <article className="step">
      <span>{index}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function StepGroup({ children }: { children: ReactNode }) {
  return <div className="step-group">{children}</div>;
}
