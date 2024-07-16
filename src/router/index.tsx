import Protected from "@/components/protected/protected";
import MainLayout from "@/pages/layout/mainLayout";
import UserInfo from "@/pages/userInfo";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const TipTap = lazy(() => import("@/pages/Tiptap"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { Home } = await import("@/pages/Home");
          return { Component: Home };
        },
      },
    ],
  },
  {
    path: "/login",
    lazy: async () => {
      const { Login } = await import("@/pages/Login");
      return { Component: Login };
    },
  },
  {
    path: "/signup",
    lazy: async () => {
      const { Signup } = await import("@/pages/Signup");
      return { Component: Signup };
    },
  },
  {
    path: "/forget",
    lazy: async () => {
      const { ForgetPassword } = await import("@/pages/FotgetPassword");
      return { Component: ForgetPassword };
    },
  },
  {
    path: "/view/:novelId",
    lazy: async () => {
      const { Viewer } = await import("@/pages/viewer");
      return { Component: Viewer };
    },
  },

  {
    path: "/protected",
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
    children: [
      {
        index: true,
        element: <h1>Protected Page</h1>,
      },
      {
        path: "edit",
        element: <TipTap />,
      },
      {
        path: "userinfo",
        element: <UserInfo />,
      },
    ],
  },
]);
