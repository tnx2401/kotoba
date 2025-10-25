export interface User {
  uid: string;
  username: string;
  join_date: string;
  email?: string;
  avatarURL?: string;
  password: string;
}

export interface UserStore {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}
