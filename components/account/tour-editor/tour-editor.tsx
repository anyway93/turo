"use client";
import "../account-home/account-home.scss";
import "./tour-editor.scss";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AccountNav } from "@/components/account/account-home/account-home";
import { Wrapper } from "@/components/layout/wrapper";
import { Button, Field, FieldLabel, Input, Textarea } from "@/components/ui";
import type { Tour } from "@/data";
import { canManageTour } from "@/lib/access";
import { useLocale } from "@/lib/locale";
import { useTuro } from "@/lib/turo-store";

export function TourEditor({ slug }: { slug: string }) {
  const { user, ready, tourBySlug } = useTuro();
  const { t } = useLocale();
  const tour = tourBySlug(slug);

  if (!ready) return <Wrapper className="account-home">{t("account.loading")}</Wrapper>;
  if (!user) {
    return (
      <Wrapper className="account-home">
        <Button asChild>
          <Link href={`/login/?next=/account/tours/${slug}/`}>{t("account.login")}</Link>
        </Button>
      </Wrapper>
    );
  }
  if (!tour || !canManageTour(user, tour.organizerId)) {
    return (
      <Wrapper className="account-home">
        <AccountNav />
        <h1>{t("account.denied")}</h1>
        <p>{t("account.deniedText")}</p>
      </Wrapper>
    );
  }

  return <TourForm tour={tour} />;
}

function TourForm({ tour }: { tour: Tour }) {
  const { updateTour, deleteTour } = useTuro();
  const { t, tx } = useLocale();
  const router = useRouter();
  const [title, setTitle] = useState(tour.title);
  const [subtitle, setSubtitle] = useState(tour.subtitle);
  const [city, setCity] = useState(tour.city);
  const [country, setCountry] = useState(tour.country);
  const [price, setPrice] = useState(tour.price);
  const [seats, setSeats] = useState(tour.seats);
  const [meeting, setMeeting] = useState(tour.meetingPoint);
  const [confirm, setConfirm] = useState(false);

  function save() {
    const result = updateTour(tour.slug, {
      title,
      subtitle,
      city,
      country,
      price: Number(price),
      seats: Number(seats),
      meetingPoint: meeting,
    });
    if (!result.ok) {
      toast.error(t(result.error ?? "error.badFields"));
      return;
    }
    toast.success(t("account.saved"));
  }

  function remove() {
    const result = deleteTour(tour.slug);
    if (!result.ok) {
      toast.error(t(result.error ?? "error.forbidden"));
      return;
    }
    toast.success(t("account.removed"));
    router.push("/account/tours/");
  }

  return (
    <Wrapper className="account-home">
      <AccountNav />
      <p className="tour-editor__back">
        <Link href="/account/tours/">{t("account.back")}</Link>
      </p>
      <h1>{t("account.editTitle")}</h1>
      <p className="tour-editor__lead">{tx(tour.title)}</p>
      <form
        className="tour-editor"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <Field>
          <FieldLabel>{t("create.name")}</FieldLabel>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </Field>
        <Field>
          <FieldLabel>{t("create.about")}</FieldLabel>
          <Textarea value={subtitle} onChange={(event) => setSubtitle(event.target.value)} rows={3} />
        </Field>
        <div className="tour-editor__grid">
          <Field>
            <FieldLabel>{t("create.city")}</FieldLabel>
            <Input value={city} onChange={(event) => setCity(event.target.value)} required />
          </Field>
          <Field>
            <FieldLabel>{t("create.country")}</FieldLabel>
            <Input value={country} onChange={(event) => setCountry(event.target.value)} required />
          </Field>
        </div>
        <div className="tour-editor__grid">
          <Field>
            <FieldLabel>{t("account.price")}</FieldLabel>
            <Input
              type="number"
              min={1}
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              required
            />
          </Field>
          <Field>
            <FieldLabel>{t("account.seatsField")}</FieldLabel>
            <Input
              type="number"
              min={tour.seatsTaken || 1}
              value={seats}
              onChange={(event) => setSeats(Number(event.target.value))}
              required
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>{t("account.meeting")}</FieldLabel>
          <Input value={meeting} onChange={(event) => setMeeting(event.target.value)} />
        </Field>
        <div className="tour-editor__bar">
          <Button type="submit" variant="cta">
            {t("account.save")}
          </Button>
          {confirm ? (
            <>
              <Button type="button" variant="destructive" onClick={remove}>
                {t("account.confirmRemove")}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setConfirm(false)}>
                {t("account.cancel")}
              </Button>
            </>
          ) : (
            <Button type="button" variant="destructive" onClick={() => setConfirm(true)}>
              {t("account.deleteTour")}
            </Button>
          )}
        </div>
        <p className="tour-editor__hint">{t("account.deleteTourHint")}</p>
      </form>
    </Wrapper>
  );
}
