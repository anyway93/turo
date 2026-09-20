import type { Conversation } from "../types";

function conv(travelerId: string, tourSlug: string, organizerId: string): Conversation {
  return {
    id: `conv-${travelerId}-${tourSlug}`,
    tourSlug,
    travelerId,
    organizerId,
  };
}

export const conversations: Conversation[] = [
  conv("usr-anna", "altai-rivers", "org-elena"),
  conv("usr-anna", "kyoto-quiet", "org-yuki"),
  conv("usr-anna", "marrakech-atlas", "org-amina"),
  conv("usr-olga", "altai-rivers", "org-elena"),
  conv("usr-dmitry", "kamchatka-volcanoes", "org-elena"),
  conv("usr-ivan", "iceland", "org-lars"),
  conv("usr-noah", "norway-fjords", "org-lars"),
  conv("usr-lara", "santorini", "org-marco"),
  conv("usr-maria", "amalfi-coast", "org-marco"),
  conv("usr-pavel", "rome-slow", "org-marco"),
  conv("usr-kenji", "kyoto-quiet", "org-yuki"),
  conv("usr-maria", "vietnam-central", "org-kai"),
  conv("usr-kate", "kenya-safari", "org-aisha"),
  conv("usr-nina", "cusco-valley", "org-sofia"),
  conv("usr-hugo", "lyon-beaujolais", "org-claire"),
  conv("usr-timur", "georgia-feast", "org-leyla"),
  conv("usr-artem", "svaneti-trails", "org-leyla"),
  conv("usr-maria", "oaxaca-table", "org-diego"),
  conv("usr-jon", "patagonia-wind", "org-sofia"),
  conv("usr-eva", "nz-south", "org-james"),
];
