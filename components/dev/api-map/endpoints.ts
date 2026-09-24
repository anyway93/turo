export type ApiEndpoint = {
  id: string;
  group: string;
  title: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  access: string;
  body?: string;
  response: string;
  errors?: string;
  note?: string;
  upload?: boolean;
};

export const apiGroups = ["Сессия", "Профиль и фото", "Туры", "Брони", "Люди", "Чат"] as const;

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: "register",
    group: "Сессия",
    title: "Регистрация",
    method: "POST",
    path: "/api/auth/register/",
    access: "Все",
    body: `{
  "name": "Анна",
  "email": "anna@example.com",
  "password": "secret1",
  "city": "Казань",
  "role": "traveler"
}`,
    response: `{ "ok": true, "user": { "id": "usr-…", "email": "anna@example.com", "role": "traveler" } }`,
    errors: "error.badFields · error.shortPassword · error.emailTaken",
    note: "role только traveler или organizer. Сессия ставится сразу.",
  },
  {
    id: "login",
    group: "Сессия",
    title: "Вход",
    method: "POST",
    path: "/api/auth/login/",
    access: "Все",
    body: `{
  "email": "anna@turo.travel",
  "password": "turo123"
}`,
    response: `{ "ok": true, "user": { "id": "usr-anna", "email": "anna@turo.travel", "role": "traveler" } }`,
    errors: "error.badCredentials",
  },
  {
    id: "logout",
    group: "Сессия",
    title: "Выход",
    method: "POST",
    path: "/api/auth/logout/",
    access: "Все",
    response: `{ "ok": true }`,
  },
  {
    id: "me",
    group: "Сессия",
    title: "Кто вошёл",
    method: "GET",
    path: "/api/auth/me/",
    access: "Все",
    response: `{ "ok": true, "user": null }`,
    note: "Без cookie user равен null, это не ошибка.",
  },
  {
    id: "account",
    group: "Профиль и фото",
    title: "Свой профиль",
    method: "PATCH",
    path: "/api/account/",
    access: "Вошедший",
    body: `{
  "name": "Анна",
  "city": "Казань",
  "country": "Россия",
  "bio": "…",
  "avatar": "/uploads/abc.jpg",
  "languages": ["Русский"]
}`,
    response: `{ "ok": true, "user": { } }`,
    errors: "error.login · error.badFields",
    note: "Можно прислать только те поля, которые меняются.",
  },
  {
    id: "upload",
    group: "Профиль и фото",
    title: "Загрузка фото",
    method: "POST",
    path: "/api/uploads/",
    access: "Вошедший",
    response: `{ "ok": true, "url": "/uploads/abc.jpg" }`,
    errors: "error.login · error.badFields · error.fileType · error.fileSize",
    note: "Поле формы file. jpeg, png, webp, gif, до 8 МБ. url потом кладётся в avatar, cover или gallery.",
    upload: true,
  },
  {
    id: "tours",
    group: "Туры",
    title: "Каталог",
    method: "GET",
    path: "/api/tours/?q=&continent=&style=&difficulty=&destination=&mine=1",
    access: "Все, mine=1 — вошедший",
    response: `{ "ok": true, "tours": [] }`,
    note: "mine=1 у организатора — его туры, у админа — все.",
  },
  {
    id: "tour",
    group: "Туры",
    title: "Один тур",
    method: "GET",
    path: "/api/tours/santorini/",
    access: "Все",
    response: `{ "ok": true, "tour": { "slug": "santorini" } }`,
    errors: "error.tourMissing",
  },
  {
    id: "tour-create",
    group: "Туры",
    title: "Создать тур",
    method: "POST",
    path: "/api/tours/",
    access: "Организатор или админ",
    body: `{
  "title": "Алтай без спешки",
  "subtitle": "Неделя по рекам",
  "city": "Чемал",
  "country": "Россия",
  "continent": "Азия",
  "difficulty": "лёгкий",
  "style": "природа",
  "price": 59000,
  "seats": 8,
  "durationDays": 7,
  "cover": "/uploads/cover.jpg",
  "gallery": [],
  "departures": [{ "start": "2026-07-04" }]
}`,
    response: `{ "ok": true, "tour": { } }`,
    errors: "error.loginToPublish · error.roleHost · error.badFields · error.slugTaken",
  },
  {
    id: "tour-patch",
    group: "Туры",
    title: "Изменить тур",
    method: "PATCH",
    path: "/api/tours/santorini/",
    access: "Хозяин тура или админ",
    body: `{
  "title": "Новое название",
  "price": 64000,
  "seats": 10,
  "cover": "/uploads/cover.jpg",
  "gallery": ["/uploads/a.jpg"]
}`,
    response: `{ "ok": true, "tour": { } }`,
    errors: "error.forbidden · error.badFields · error.seatsLow",
  },
  {
    id: "tour-delete",
    group: "Туры",
    title: "Скрыть тур",
    method: "DELETE",
    path: "/api/tours/santorini/",
    access: "Хозяин тура или админ",
    response: `{ "ok": true }`,
    errors: "error.forbidden",
    note: "Тур пропадает из каталога. Брони остаются.",
  },
  {
    id: "destinations",
    group: "Туры",
    title: "Направления",
    method: "GET",
    path: "/api/destinations/",
    access: "Все",
    response: `{ "ok": true, "destinations": [] }`,
  },
  {
    id: "reviews",
    group: "Туры",
    title: "Отзывы тура",
    method: "GET",
    path: "/api/tours/santorini/reviews/",
    access: "Все",
    response: `{ "ok": true, "reviews": [] }`,
    errors: "error.tourMissing",
  },
  {
    id: "review-create",
    group: "Туры",
    title: "Оставить отзыв",
    method: "POST",
    path: "/api/tours/santorini/reviews/",
    access: "Путешественник с бронью completed",
    body: `{
  "rating": 5,
  "title": "Спокойный темп",
  "text": "Как и обещали."
}`,
    response: `{ "ok": true, "review": { } }`,
    errors: "error.login · error.forbidden · error.reviewAfterTrip · error.reviewExists · error.badFields",
  },
  {
    id: "bookings",
    group: "Брони",
    title: "Список броней",
    method: "GET",
    path: "/api/bookings/",
    access: "Вошедший",
    response: `{ "ok": true, "bookings": [] }`,
    note: "Путешественник видит свои. Организатор — брони своих туров. Админ — все.",
    errors: "error.login",
  },
  {
    id: "book",
    group: "Брони",
    title: "Оплатить бронь",
    method: "POST",
    path: "/api/bookings/",
    access: "Путешественник",
    body: `{
  "tourSlug": "santorini",
  "departureStart": "2026-06-12",
  "guests": 2,
  "cardLast4": "4242"
}`,
    response: `{ "ok": true, "booking": { "status": "paid" }, "conversationId": "conv-…" }`,
    errors: "error.loginToPay · error.roleBook · error.badFields · error.tourMissing · error.ownTour · error.noSeats · error.alreadyBooked",
  },
  {
    id: "booking-status",
    group: "Брони",
    title: "Статус брони",
    method: "PATCH",
    path: "/api/bookings/bk-anna-altai/",
    access: "Участник брони",
    body: `{ "status": "cancelled" }`,
    response: `{ "ok": true, "booking": { "status": "cancelled" } }`,
    errors: "error.login · error.forbidden · error.badFields",
    note: "Путешественник может только cancelled. Организатор — confirmed, completed или cancelled. Отмена возвращает места.",
  },
  {
    id: "users",
    group: "Люди",
    title: "Все пользователи",
    method: "GET",
    path: "/api/users/",
    access: "Админ",
    response: `{ "ok": true, "users": [] }`,
    errors: "error.forbidden",
  },
  {
    id: "user",
    group: "Люди",
    title: "Профиль",
    method: "GET",
    path: "/api/users/org-elena/",
    access: "Все",
    response: `{ "ok": true, "user": { "name": "Елена Волкова" } }`,
    note: "email есть только у себя и у админа.",
    errors: "error.forbidden",
  },
  {
    id: "user-patch",
    group: "Люди",
    title: "Править пользователя",
    method: "PATCH",
    path: "/api/users/usr-anna/",
    access: "Админ",
    body: `{
  "name": "Анна",
  "city": "Москва",
  "bio": "…",
  "role": "traveler"
}`,
    response: `{ "ok": true, "user": { } }`,
    errors: "error.forbidden · error.badFields · error.ownRole · error.lastAdmin",
  },
  {
    id: "user-delete",
    group: "Люди",
    title: "Удалить пользователя",
    method: "DELETE",
    path: "/api/users/usr-anna/",
    access: "Админ",
    response: `{ "ok": true }`,
    errors: "error.forbidden · error.ownDelete · error.lastAdmin · error.userHasTours · error.userHasBookings",
  },
  {
    id: "chats",
    group: "Чат",
    title: "Диалоги",
    method: "GET",
    path: "/api/conversations/",
    access: "Вошедший",
    response: `{ "ok": true, "conversations": [] }`,
    errors: "error.login",
  },
  {
    id: "chat-open",
    group: "Чат",
    title: "Открыть диалог",
    method: "POST",
    path: "/api/conversations/",
    access: "Путешественник с бронью",
    body: `{ "tourSlug": "santorini" }`,
    response: `{ "ok": true, "conversation": { "id": "conv-…" } }`,
    errors: "error.login · error.badFields · error.tourMissing · error.chatFromList · error.chatAfterPay",
  },
  {
    id: "messages",
    group: "Чат",
    title: "Сообщения",
    method: "GET",
    path: "/api/conversations/conv-usr-anna-altai-rivers/messages/",
    access: "Участник диалога",
    response: `{ "ok": true, "messages": [] }`,
    errors: "error.login · error.forbidden",
  },
  {
    id: "message-send",
    group: "Чат",
    title: "Отправить сообщение",
    method: "POST",
    path: "/api/conversations/conv-usr-anna-altai-rivers/messages/",
    access: "Участник диалога",
    body: `{ "text": "Во сколько встреча?" }`,
    response: `{ "ok": true, "message": { "text": "Во сколько встреча?" } }`,
    errors: "error.login · error.forbidden · error.badFields",
  },
];

export function fetchSnippet(endpoint: ApiEndpoint) {
  if (endpoint.upload) {
    return `const form = new FormData();
form.append("file", file);
const res = await fetch("${endpoint.path}", {
  method: "POST",
  credentials: "include",
  body: form,
});
const data = await res.json();`;
  }

  const lines = [
    `const res = await fetch("${endpoint.path}", {`,
    `  method: "${endpoint.method}",`,
    `  credentials: "include",`,
  ];
  if (endpoint.body) {
    lines.push(`  headers: { "Content-Type": "application/json" },`);
    lines.push(`  body: JSON.stringify(${endpoint.body}),`);
  }
  lines.push(`});`, `const data = await res.json();`);
  return lines.join("\n");
}
