import { UserData } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UserData, token: string) => void;
  register: (user: UserData, token: string) => void;
  setUser: (user: UserData | null) => void;
  logout: () => void;
  updateUser: (user: Partial<UserData>) => void;
  initialize: () => void;
  getToken: () => string | null;
  startSessionTimer: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("loginTime", Date.now().toString());
        }

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        get().startSessionTimer();
      },

      register: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("loginTime", Date.now().toString());
        }

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        get().startSessionTimer();
      },

      setUser: (user) => {
        set((state) => ({
          user,
          isAuthenticated: !!user && !!state.token,
        }));
      },

      //  Logout: full cleanup
      logout: () => {
        if (typeof window !== "undefined") {
          const savedTimer = localStorage.getItem("logoutTimer");
          if (savedTimer) clearTimeout(Number(savedTimer));

          localStorage.removeItem("logoutTimer");
          localStorage.removeItem("token");
          localStorage.removeItem("loginTime");
          localStorage.removeItem("user-storage");
          sessionStorage.removeItem("token");
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      //  Update part of user object
      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },

      //  Initialize on app load (rehydrate from localStorage)
      initialize: () => {
        set((state) => {
          const storedToken =
            typeof window !== "undefined"
              ? localStorage.getItem("token")
              : null;
          const hasAuth = !!(state.user && (state.token || storedToken));

          if (storedToken && storedToken !== state.token) {
            return {
              token: storedToken,
              isLoading: false,
              isAuthenticated: !!state.user && !!storedToken,
            };
          }

          if (hasAuth) get().startSessionTimer();

          return {
            isLoading: false,
            isAuthenticated: hasAuth,
          };
        });
      },

      //  Get token helper (keeps sync)
      getToken: () => {
        const state = get();
        if (typeof window !== "undefined") {
          const storedToken = localStorage.getItem("token");
          if (storedToken && storedToken !== state.token) {
            set({ token: storedToken });
            return storedToken;
          }
        }
        return state.token;
      },

      startSessionTimer: () => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        const loginTime = localStorage.getItem("loginTime");

        if (!token || !loginTime) return;

        const currentTime = Date.now();
        const elapsedTime = currentTime - parseInt(loginTime, 10);
        const maxSession = 3 * 24 * 60 * 60 * 1000; // 3 days

        if (elapsedTime >= maxSession) {
          get().logout();
          return;
        }

        const remainingTime = maxSession - elapsedTime;
        const timerId = window.setTimeout(() => {
          get().logout();
        }, remainingTime);

        localStorage.setItem("logoutTimer", String(timerId));
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          const storedToken = localStorage.getItem("token");
          if (storedToken && storedToken !== state.token) {
            state.token = storedToken;
            state.isAuthenticated = !!(state.user && storedToken);
          }
          state.isLoading = false;

          useUserStore.getState().startSessionTimer();
        }
      },
    }
  )
);

export const useAuthToken = () => useUserStore((s) => s.getToken());
export const useIsAuthenticated = () =>
  useUserStore((s) => s.isAuthenticated && !!s.token);
