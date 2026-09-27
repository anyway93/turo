import type { ApiUser } from "../types";

export interface IResponseSession {
  ok: true;
  user: ApiUser;
}

export interface IResponseMe {
  ok: true;
  user: ApiUser | null;
}
