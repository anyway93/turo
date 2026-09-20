import type { ChatMessage } from "../types";

function line(
  conversationId: string,
  senderId: string,
  text: string,
  createdAt: string,
  index: number,
): ChatMessage {
  return {
    id: `${conversationId}-m${index}`,
    conversationId,
    senderId,
    text,
    createdAt,
  };
}

export const messages: ChatMessage[] = [
  ...[
    ["Привет, Елена! Подскажите, тёплый спальник нужен в июле?", "usr-anna", "2026-02-11T12:00:00.000Z"],
    ["Добрый день. В июле ночью в горах до +8. Достаточно трёхсезонного, у нас есть прокат.", "org-elena", "2026-02-11T12:18:00.000Z"],
    ["Отлично. Можно приехать на день раньше?", "usr-anna", "2026-02-12T08:02:00.000Z"],
    ["Да. Напишите рейс — встретим или подскажем гостиницу у аэропорта.", "org-elena", "2026-02-12T08:40:00.000Z"],
  ].map((row, i) => line("conv-usr-anna-altai-rivers", row[1], row[0], row[2], i)),
  ...[
    ["Здравствуйте! Есть места ещё на двоих? Едем с сыном 14 лет.", "usr-olga", "2026-02-20T11:30:00.000Z"],
    ["Здравствуйте. Да, двое мест есть. Темп спокойный, подросткам заходит.", "org-elena", "2026-02-20T11:44:00.000Z"],
    ["Супер. А розетки в домах обычные?", "usr-olga", "2026-02-21T09:10:00.000Z"],
    ["Обычные евро. Пауэрбанк всё равно возьмите в дорогу по тракту.", "org-elena", "2026-02-21T09:22:00.000Z"],
  ].map((row, i) => line("conv-usr-olga-altai-rivers", row[1], row[0], row[2], i)),
  ...[
    ["Елена, по Камчатке: вертолёт уже в цене?", "usr-dmitry", "2026-03-18T19:20:00.000Z"],
    ["Да, заложили. Если погода закроет — вернём эту часть или перенесём день.", "org-elena", "2026-03-18T19:35:00.000Z"],
    ["Понял. Ботинки какие?", "usr-dmitry", "2026-03-19T07:01:00.000Z"],
    ["Треккинговые с фиксацией голеностопа. Штрипки не обязательны.", "org-elena", "2026-03-19T07:15:00.000Z"],
  ].map((row, i) => line("conv-usr-dmitry-kamchatka-volcanoes", row[1], row[0], row[2], i)),
  ...[
    ["Yuki, is luggage storage ok on day 1?", "usr-anna", "2026-01-20T15:00:00.000Z"],
    ["Yes. We meet at Kyoto Station clock. Coin lockers are nearby, I will show you.", "org-yuki", "2026-01-20T15:12:00.000Z"],
    ["Thank you. Vegetarian dinners possible?", "usr-anna", "2026-01-21T10:00:00.000Z"],
    ["Yes, I already marked it. We will skip the eel place.", "org-yuki", "2026-01-21T10:08:00.000Z"],
  ].map((row, i) => line("conv-usr-anna-kyoto-quiet", row[1], row[0], row[2], i)),
  ...[
    ["到着は16:40です。東口で合っていますか？", "usr-kenji", "2026-01-11T12:00:00.000Z"],
    ["はい、時計の下で待ちます。遅れてもメッセージください。", "org-yuki", "2026-01-11T12:06:00.000Z"],
  ].map((row, i) => line("conv-usr-kenji-kyoto-quiet", row[1], row[0], row[2], i)),
  ...[
    ["Amina, пустыня — ночь в палатке или в касре?", "usr-anna", "2026-01-08T10:00:00.000Z"],
    ["В лагере с нормальными кроватями, не на песке. Палатка — только если захотите смотреть звёзды.", "org-amina", "2026-01-08T10:20:00.000Z"],
    ["Берём шарфы от песка?", "usr-anna", "2026-01-09T18:11:00.000Z"],
    ["Да. И закрытую обувь на дюны вечером.", "org-amina", "2026-01-09T18:19:00.000Z"],
  ].map((row, i) => line("conv-usr-anna-marrakech-atlas", row[1], row[0], row[2], i)),
  ...[
    ["Lars, rental car included or we sit with you?", "usr-ivan", "2026-03-01T16:40:00.000Z"],
    ["You sit with me. One van, eight seats. No extra car.", "org-lars", "2026-03-01T16:55:00.000Z"],
  ].map((row, i) => line("conv-usr-ivan-iceland", row[1], row[0], row[2], i)),
  ...[
    ["Will we see the midnight sun on this date?", "usr-noah", "2026-03-03T10:00:00.000Z"],
    ["Yes, in July it does not really set. Bring a sleep mask.", "org-lars", "2026-03-03T10:12:00.000Z"],
  ].map((row, i) => line("conv-usr-noah-norway-fjords", row[1], row[0], row[2], i)),
  ...[
    ["Marco, boat day if the sea is rough?", "usr-lara", "2026-02-09T11:00:00.000Z"],
    ["We move it. The coast is still there on foot.", "org-marco", "2026-02-09T11:14:00.000Z"],
    ["Perfetto. Rooms with a view or quiet yard?", "usr-lara", "2026-02-10T08:40:00.000Z"],
    ["Quiet yard. View costs the whole night of sleep.", "org-marco", "2026-02-10T08:51:00.000Z"],
  ].map((row, i) => line("conv-usr-lara-santorini", row[1], row[0], row[2], i)),
  ...[
    ["Можно без морепродуктов? Аллергия.", "usr-maria", "2026-01-30T13:00:00.000Z"],
    ["Конечно. Лимоны оставим, креветки уберём.", "org-marco", "2026-01-30T13:09:00.000Z"],
  ].map((row, i) => line("conv-usr-maria-amalfi-coast", row[1], row[0], row[2], i)),
  ...[
    ["Рим: отель в Трастевере уже забронирован вами?", "usr-pavel", "2025-12-01T10:00:00.000Z"],
    ["Да, три ночи в одном доме. Адрес пришлю за неделю.", "org-marco", "2025-12-01T10:20:00.000Z"],
  ].map((row, i) => line("conv-usr-pavel-rome-slow", row[1], row[0], row[2], i)),
  ...[
    ["Кай, острое можно попросить слабее?", "usr-maria", "2026-02-02T10:40:00.000Z"],
    ["Да. Скажите за столом «không cay», я повторю хозяйке.", "org-kai", "2026-02-02T10:48:00.000Z"],
  ].map((row, i) => line("conv-usr-maria-vietnam-central", row[1], row[0], row[2], i)),
  ...[
    ["Malaria tablets — required?", "usr-kate", "2026-04-10T10:30:00.000Z"],
    ["Ask your doctor. We are in Mara in August; I am not a clinic. Yellow fever cert if you transit.", "org-aisha", "2026-04-10T10:42:00.000Z"],
  ].map((row, i) => line("conv-usr-kate-kenya-safari", row[1], row[0], row[2], i)),
  ...[
    ["София, кока от высоты — это часть программы?", "usr-nina", "2026-02-28T18:00:00.000Z"],
    ["Чай можно. Программа — медленный первый день, не аптека.", "org-sofia", "2026-02-28T18:11:00.000Z"],
  ].map((row, i) => line("conv-usr-nina-cusco-valley", row[1], row[0], row[2], i)),
  ...[
    ["Claire, dégustations with a designated driver?", "usr-hugo", "2026-03-22T13:00:00.000Z"],
    ["Yes. I drive. You taste. We eat before the cellars.", "org-claire", "2026-03-22T13:08:00.000Z"],
  ].map((row, i) => line("conv-usr-hugo-lyon-beaujolais", row[1], row[0], row[2], i)),
  ...[
    ["Лейла, можно без крепкого?", "usr-timur", "2026-03-09T10:00:00.000Z"],
    ["Можно. Чача не обязательна, стол всё равно будет.", "org-leyla", "2026-03-09T10:09:00.000Z"],
  ].map((row, i) => line("conv-usr-timur-georgia-feast", row[1], row[0], row[2], i)),
  ...[
    ["Палатки или дома в Ушгули?", "usr-artem", "2026-03-05T08:20:00.000Z"],
    ["Дома. Палатку не тащим: ночи холодные даже в июле.", "org-leyla", "2026-03-05T08:31:00.000Z"],
  ].map((row, i) => line("conv-usr-artem-svaneti-trails", row[1], row[0], row[2], i)),
  ...[
    ["Diego, vegetarian mole exists?", "usr-maria", "2026-03-12T16:00:00.000Z"],
    ["Yes. Coloradito without chicken, still serious.", "org-diego", "2026-03-12T16:07:00.000Z"],
  ].map((row, i) => line("conv-usr-maria-oaxaca-table", row[1], row[0], row[2], i)),
  ...[
    ["If Fitz Roy is closed two days, what then?", "usr-jon", "2025-12-20T21:00:00.000Z"],
    ["Glacier, steppe, shorter valley walks. We do not invent sunshine.", "org-sofia", "2025-12-20T21:16:00.000Z"],
  ].map((row, i) => line("conv-usr-jon-patagonia-wind", row[1], row[0], row[2], i)),
  ...[
    ["Campervan or lodges?", "usr-eva", "2025-11-11T12:00:00.000Z"],
    ["Lodges and motels. Camper is a different trip.", "org-james", "2025-11-11T12:11:00.000Z"],
  ].map((row, i) => line("conv-usr-eva-nz-south", row[1], row[0], row[2], i)),
];
