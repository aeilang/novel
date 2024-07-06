import Protected from "@/components/protected/protected";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Tiptap from "@/pages/Tiptap";
import MainLayout from "@/pages/layout/mainLayout";
import Viewer from "@/pages/viewer";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/view/:novelId",
    element: <Viewer />,
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
        element: <Tiptap />,
      },
    ],
  },
]);
