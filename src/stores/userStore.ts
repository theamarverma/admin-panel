import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface UserStore {
  users: User[];
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (updatedUser: User) => void;
  getUserById: (id: string) => User | undefined;
  deleteUser: (id: string) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    immer((set, get) => ({
      users: [],
      addUser: (user) => {
        set((state) => {
          state.users.push({ ...user, id: uuidv4() });
        });
      },
      updateUser: (updatedUser) => {
        set((state) => {
          const index = state.users.findIndex(
            (user: User) => user.id === updatedUser.id,
          );
          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        });
      },
      getUserById: (id: string) => get().users.find((user) => user.id === id),
      deleteUser: (id: string) => {
        set((state) => {
          state.users = state.users.filter((user: User) => user.id !== id);
        });
      },
    })),
    {
      name: "user-store",
    },
  ),
);

export default useUserStore;
