import { User } from "./user"

export type FullMessageType = {
  id: number,
  createdAt: Date,
  body: string,
  image: string,
  senderId: number,
  sender: User,
  seen: User[],
}

export type FullConversationType = {
  ID: number,
  Name: string,
  isGroup: boolean,
  Users: User[],
  messages: FullMessageType[],
}