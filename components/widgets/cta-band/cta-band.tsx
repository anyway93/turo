import "./cta-band.scss";
import { Button, type ButtonVariant } from "@/components/ui";

export type CtaAction = {
  label: string;
  variant?: ButtonVariant;
};

type CtaBandProps = {
  id?: string;
  title: string;
  text: string;
  actions: CtaAction[];
};

export function CtaBand({ id, title, text, actions }: CtaBandProps) {
  return (
    <section className="cta-band" id={id}>
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="cta-band__actions">
        {actions.map((action) => (
          <Button key={action.label} variant={action.variant ?? "cta"} size="lg">
            {action.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
