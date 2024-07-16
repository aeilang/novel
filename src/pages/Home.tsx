import { useAuth } from "@/store/auth-store";

export function Home() {
  const { isAuth, email, role, accessToken, refreshToken } = useAuth();
  return (
    <>
      {isAuth ? (
        <div>
          <h1>email: {email}</h1>
          <p>access token: {accessToken}</p>
          <p>refresh token: {refreshToken}</p>
          <p>role: {role}</p>
        </div>
      ) : (
        <h1>Hello world</h1>
      )}
    </>
  );
}
