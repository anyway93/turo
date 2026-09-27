import type { Destination } from "@/models";

export interface IResponseDestinations {
  ok: true;
  destinations: Destination[];
}
