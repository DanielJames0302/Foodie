import { User } from "./user"

export type FullMessageType = {
  ID: number,
  CreatedAt: Date,
  Body: string,
  image: string,
  SenderId: number,
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