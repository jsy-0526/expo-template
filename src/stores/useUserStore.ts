import { create } from 'zustand';

// User store - memory only
interface UserState {
  currentUser: {
    id: string;
    name: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
  setUser: (user: UserState['currentUser']) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      currentUser: user,
      isAuthenticated: !!user,
    }),
  logout: () =>
    set({
      currentUser: null,
      isAuthenticated: false,
    }),
}));
