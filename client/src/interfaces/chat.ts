import { User } from "./user"

export type FullMessageType = {
  id: number,
  CreatedAt: Date,
  Body: string,
  image: string,
  senderId: number,
  Sender: User,
  SeenIds: User[],
}

export type FullConversationType = {
  ID: number,
  Name: string,
  isGroup: boolean,
  Users: User[],
  Messages: FullMessageType[],
}