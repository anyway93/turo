import axios from "axios";
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ME, AUTH_REGISTER } from "../endpoints";
import type { IResponseOk } from "../types";
import type { LoginInput, RegisterInput } from "./request.type";
import type { IResponseMe, IResponseSession } from "./response.type";

export const register = async (body: RegisterInput) => {
  const res = await axios.post<IResponseSession>(AUTH_REGISTER, body);
  return res.data;
};

export const login = async (body: LoginInput) => {
  const res = await axios.post<IResponseSession>(AUTH_LOGIN, body);
  return res.data;
};

export const logout = async () => {
  const res = await axios.post<IResponseOk>(AUTH_LOGOUT);
  return res.data;
};

export const getMe = async () => {
  const res = await axios.get<IResponseMe>(AUTH_ME);
  return res.data;
};
