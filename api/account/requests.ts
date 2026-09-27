import axios from "axios";
import { ACCOUNT } from "../endpoints";
import type { UpdateAccountInput } from "./request.type";
import type { IResponseAccount } from "./response.type";

export const updateAccount = async (body: UpdateAccountInput) => {
  const res = await axios.patch<IResponseAccount>(ACCOUNT, body);
  return res.data;
};
