import React, { createContext, useContext, useState } from "react";

import Cookies from "js-cookie";

export type User = {
  userId: string;
  role: "admin" | "user";
  token: string;
};

type AuthProviderState = {
  user: User | null;
  isAuth: boolean;
  setUser: (user: User | null) => void;
};

const AuthProviderContext = createContext<AuthProviderState>({
  user: null,
  isAuth: false,
  setUser: () => null,
});

export function AuthProvider({
  children,
  storageKey = "auth",
  ...props
}: {
  children: React.ReactNode;
  storageKey?: string;
}) {
  const [user, setUser] = useState<User | null>(() => {
    const userString = Cookies.get(storageKey);
    if (!userString) {
      return null;
    }

    return JSON.parse(userString) as User;
  });

  const isAuth = !!user;

  const setAuth = (user: User | null) => {
    if (!user) {
      Cookies.remove(storageKey);
    } else {
      const userJSON = JSON.stringify(user);
      Cookies.set(storageKey, userJSON);
    }

    setUser(user);
  };

  const value: AuthProviderState = {
    user: user,
    isAuth: isAuth,
    setUser: setAuth,
  };

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);
  if (context === undefined) {
    throw new Error("userTheme must be used within a AuthProviders");
  }

  return context;
};
