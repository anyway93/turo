import type { Metadata } from "next";
import { TermsToc } from "@/components/terms/terms-toc";
import { Wrapper } from "@/components/layout/wrapper";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { termsMeta, termsSections } from "@/data";
import "./terms.scss";

export const metadata: Metadata = {
  title: "Пользовательское соглашение — Turo",
  description: `Публичная оферта ООО «Туро Тревел». Редакция ${termsMeta.version} от ${termsMeta.effective}.`,
};

function splitTitle(title: string) {
  const index = title.indexOf(". ");
  if (index === -1) return { num: "", heading: title };
  return { num: title.slice(0, index), heading: title.slice(index + 2) };
}

function splitClause(text: string) {
  const match = text.match(/^(\d+\.\d+\.)\s+([\s\S]+)/);
  if (!match) return { num: "", body: text };
  return { num: match[1], body: match[2] };
}

export default function TermsPage() {
  return (
    <main className="terms-page">
      <Wrapper>
        <header className="terms-page__hero">
          <Eyebrow>Правовая информация</Eyebrow>
          <h1>Пользовательское соглашение</h1>
          <p>
            Публичная оферта. Регистрация, туры, оплата, отмена, чат и ответственность сторон —
            в одном документе.
          </p>
        </header>

        <div className="terms-page__facts">
          <div>
            <span>Редакция</span>
            <strong>{termsMeta.version}</strong>
          </div>
          <div>
            <span>Опубликовано</span>
            <strong>{termsMeta.published.replace(" г.", "")}</strong>
          </div>
          <div>
            <span>Вступает в силу</span>
            <strong>{termsMeta.effective.replace(" г.", "")}</strong>
          </div>
          <div>
            <span>Оператор</span>
            <strong>{termsMeta.short}</strong>
          </div>
        </div>

        <div className="terms-page__layout">
          <TermsToc
            items={termsSections.map((section) => {
              const { num, heading } = splitTitle(section.title);
              return { id: section.id, num, heading };
            })}
          />

          <div className="terms-page__doc">
            <section className="terms-page__intro">
              <p>
                Используя сайт turo.travel, создавая профиль, публикуя тур или нажимая «Оплатить», вы
                принимаете эту оферту целиком. Если действуете от имени компании — подтверждаете
                полномочия на акцепт.
              </p>
              <dl>
                <div>
                  <dt>Документ</dt>
                  <dd>{termsMeta.title}</dd>
                </div>
                <div>
                  <dt>Реквизиты</dt>
                  <dd>
                    ОГРН {termsMeta.ogrn}
                    <br />
                    ИНН {termsMeta.inn} · КПП {termsMeta.kpp}
                  </dd>
                </div>
                <div>
                  <dt>Адрес</dt>
                  <dd>{termsMeta.address}</dd>
                </div>
                <div>
                  <dt>Юридическая почта</dt>
                  <dd>
                    <a href={`mailto:${termsMeta.email}`}>{termsMeta.email}</a>
                  </dd>
                </div>
              </dl>
            </section>

            {termsSections.map((section) => {
              const { num, heading } = splitTitle(section.title);
              return (
                <article
                  key={section.id}
                  id={`article-${section.id}`}
                  className="terms-page__article"
                >
                  <h2>
                    <span>{num}</span>
                    {heading}
                  </h2>
                  {section.paragraphs.map((paragraph, index) => {
                    const clause = splitClause(paragraph);
                    if (!clause.num) {
                      return <p key={index}>{paragraph}</p>;
                    }
                    return (
                      <p key={index} className="terms-page__clause">
                        <span>{clause.num}</span>
                        {clause.body}
                      </p>
                    );
                  })}
                </article>
              );
            })}

            <footer className="terms-page__end">
              <p>
                Актуальная редакция всегда на этой странице. Вопросы по документу —{" "}
                <a href={`mailto:${termsMeta.email}`}>{termsMeta.email}</a>. По конкретной поездке
                пишите организатору в чат брони.
              </p>
            </footer>
          </div>
        </div>
      </Wrapper>
    </main>
  );
}
