import type { ChatMessage, Conversation } from "@/models";

export interface IResponseConversations {
  ok: true;
  conversations: Conversation[];
}

export interface IResponseConversation {
  ok: true;
  conversation: Conversation;
}

export interface IResponseMessages {
  ok: true;
  messages: ChatMessage[];
}

export interface IResponseMessage {
  ok: true;
  message: ChatMessage;
}
