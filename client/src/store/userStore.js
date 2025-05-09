import { create } from "zustand";

const userStore = create((set) => {
  const storedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return {
    user: storedUser,
    setUser: (user) => {
      set({ user });
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: () => {
      set({ user: null });
      localStorage.removeItem("user");
    },
  };
});

export const useStore = userStore;
