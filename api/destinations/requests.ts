import axios from "axios";
import { DESTINATIONS } from "../endpoints";
import type { IResponseDestinations } from "./response.type";

export const getDestinations = async () => {
  const res = await axios.get<IResponseDestinations>(DESTINATIONS);
  return res.data;
};
