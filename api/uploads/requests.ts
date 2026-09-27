import axios from "axios";
import { UPLOADS } from "../endpoints";
import type { IResponseUpload } from "./response.type";

export const uploadImage = async (file: File) => {
  const form = new FormData();
  form.append("file", file);
  const res = await axios.post<IResponseUpload>(UPLOADS, form);
  return res.data;
};
