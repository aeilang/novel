import Theme from "@/components/theme/theme";
import { useAuth } from "@/store/auth-store";

import { Edit, LogIn, LogOut, Youtube } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  const { isAuth, logout, email, role } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex w-screen bg-slate-300 justify-between p-2">
        <div>
          <Link to={"/"}>
            <Youtube className="size-10 ml-10" />
          </Link>
        </div>
        <div className="flex space-x-5 space-y-0 items-center mr-10">
          {isAuth ? (
            <button onClick={logout}>
              <LogOut />
            </button>
          ) : (
            <Link to={"/login"}>
              <LogIn />
            </Link>
          )}
          <Link to={"/protected/edit"}>
            <Edit />
          </Link>

          {isAuth && (
            <p>
              {email} {role}
            </p>
          )}

          <Theme />
        </div>
      </div>
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
}
