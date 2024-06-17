export interface UserState{
  isAuthenticated: boolean;
  user: User;
}

export interface User{
  ID: number;
  username: string;
  email: string;
  name: string;
  profilePic: string;
}

export interface UserPayload{
  user:User;
}