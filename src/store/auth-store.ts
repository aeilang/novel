import Cookies from "js-cookie";
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

type AuthState = {
  email: string;
  role: "admin" | "user";
  isAuth: boolean;
  accessToken: string;
  refreshToken: string;
};

type AuthAction = {
  login: (data: Pick<AuthState, "accessToken" | "refreshToken">) => void;
  logout: () => void;
};

const AccessTokenKey = "access_key";
const RefreshTokenKey = "refresh_key";

export const useAuth = create<AuthState & AuthAction>((set) => {
  const accessToken = Cookies.get(AccessTokenKey);
  const refreshToken = Cookies.get(RefreshTokenKey);

  let email = "";
  let role: "admin" | "user" = "user";

  if (accessToken) {
    const decoded = jwtDecode<Pick<AuthState, "email" | "role">>(accessToken);
    email = decoded?.email;
    role = decoded?.role;
  }

  return {
    email: email,
    role: role,
    isAuth: !!accessToken,
    accessToken: accessToken || "",
    refreshToken: refreshToken || "",
    login: (data: Pick<AuthState, "accessToken" | "refreshToken">) => {
      const accessDecoded = jwtDecode<
        { exp: number } & Pick<AuthState, "email" | "role">
      >(data.accessToken);

      Cookies.set(AccessTokenKey, data.accessToken);

      const refreshDecoded = jwtDecode<{ exp: number }>(data.refreshToken);
      Cookies.set(RefreshTokenKey, data.refreshToken, {
        expires: new Date(refreshDecoded.exp * 1000),
      });
      console.log("login Cookie setting");
      set(() => ({
        email: accessDecoded.email,
        role: accessDecoded.role,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuth: true,
      }));
    },
    logout: () => {
      set(() => ({
        email: "",
        role: "user",
        accessToken: "",
        refreshToken: "",
        isAuth: false,
      }));

      Cookies.remove(AccessTokenKey);
      Cookies.remove(RefreshTokenKey);
    },
  };
});
