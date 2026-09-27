import type { ApiUser } from "../types";

export interface IResponseUsers {
  ok: true;
  users: ApiUser[];
}

export interface IResponseUser {
  ok: true;
  user: ApiUser;
}
