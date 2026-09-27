import axios from "axios";
import { USERS, userUrl } from "../endpoints";
import type { IResponseOk } from "../types";
import type { UpdateUserInput } from "./request.type";
import type { IResponseUser, IResponseUsers } from "./response.type";

export const getUsers = async () => {
  const res = await axios.get<IResponseUsers>(USERS);
  return res.data;
};

export const getUser = async (id: string) => {
  const res = await axios.get<IResponseUser>(userUrl(id));
  return res.data;
};

export const updateUser = async (id: string, body: UpdateUserInput) => {
  const res = await axios.patch<IResponseUser>(userUrl(id), body);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axios.delete<IResponseOk>(userUrl(id));
  return res.data;
};
