import axios from "axios";
import { CONVERSATIONS, messagesUrl } from "../endpoints";
import type { OpenConversationInput, SendMessageInput } from "./request.type";
import type {
  IResponseConversation,
  IResponseConversations,
  IResponseMessage,
  IResponseMessages,
} from "./response.type";

export const getConversations = async () => {
  const res = await axios.get<IResponseConversations>(CONVERSATIONS);
  return res.data;
};

export const openConversation = async (body: OpenConversationInput) => {
  const res = await axios.post<IResponseConversation>(CONVERSATIONS, body);
  return res.data;
};

export const getMessages = async (conversationId: string) => {
  const res = await axios.get<IResponseMessages>(messagesUrl(conversationId));
  return res.data;
};

export const sendMessage = async (conversationId: string, body: SendMessageInput) => {
  const res = await axios.post<IResponseMessage>(messagesUrl(conversationId), body);
  return res.data;
};
