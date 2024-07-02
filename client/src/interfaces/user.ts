export interface UserState{
  isAuthenticated: boolean;
  user: User;
}

export interface User{
  ID: number;
  CreatedAt: Date;
  username: string;
  email: string;
  name: string;
  profilePic: string;
}

export interface UserPayload{
  user:User;
}