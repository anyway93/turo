"use client";

import { TermsToc } from "@/components/terms/terms-toc";
import { Wrapper } from "@/components/layout/wrapper";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { termsMeta, termsSections, termsSectionsEn } from "@/data";
import { useLocale } from "@/lib/locale";

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

export function TermsView() {
  const { t, locale } = useLocale();
  const sections = locale === "en" ? termsSectionsEn : termsSections;
  const operator = t("terms.operatorShort");
  const address = t("terms.operatorAddr");
  const docTitle = t("terms.metaTitle");
  const published = t("terms.metaPublished");
  const effective = t("terms.metaEffective");

  return (
    <main className="terms-page">
      <Wrapper>
        <header className="terms-page__hero">
          <Eyebrow>{t("terms.kicker")}</Eyebrow>
          <h1>{t("terms.title")}</h1>
          <p>{t("terms.lead")}</p>
        </header>

        <div className="terms-page__facts">
          <div>
            <span>{t("terms.version")}</span>
            <strong>{termsMeta.version}</strong>
          </div>
          <div>
            <span>{t("terms.published")}</span>
            <strong>{published}</strong>
          </div>
          <div>
            <span>{t("terms.effective")}</span>
            <strong>{effective}</strong>
          </div>
          <div>
            <span>{t("terms.operator")}</span>
            <strong>{operator}</strong>
          </div>
        </div>

        <div className="terms-page__layout">
          <TermsToc
            items={sections.map((section) => {
              const { num, heading } = splitTitle(section.title);
              return { id: section.id, num, heading };
            })}
          />

          <div className="terms-page__doc">
            <section className="terms-page__intro">
              <p>{t("terms.intro")}</p>
              <dl>
                <div>
                  <dt>{t("terms.doc")}</dt>
                  <dd>{docTitle}</dd>
                </div>
                <div>
                  <dt>{t("terms.requisites")}</dt>
                  <dd>
                    OGRN {termsMeta.ogrn}
                    <br />
                    INN {termsMeta.inn} · KPP {termsMeta.kpp}
                  </dd>
                </div>
                <div>
                  <dt>{t("terms.address")}</dt>
                  <dd>{address}</dd>
                </div>
                <div>
                  <dt>{t("terms.legalMail")}</dt>
                  <dd>
                    <a href={`mailto:${termsMeta.email}`}>{termsMeta.email}</a>
                  </dd>
                </div>
              </dl>
            </section>

            {sections.map((section) => {
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
                {t("terms.end", { email: termsMeta.email }).split(termsMeta.email).map((chunk, index, arr) => (
                  <span key={index}>
                    {chunk}
                    {index < arr.length - 1 ? (
                      <a href={`mailto:${termsMeta.email}`}>{termsMeta.email}</a>
                    ) : null}
                  </span>
                ))}
              </p>
            </footer>
          </div>
        </div>
      </Wrapper>
    </main>
  );
}
