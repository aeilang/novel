import { Button } from "@/components/ui/button";
import { controlApi } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { time } from "console";
import { useState } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return controlApi.get<User>(`/user/${id}`).then((resp) => resp.data);
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });

  return (
    <>
      <h1>Hello world</h1>

      <Button
        onClick={() => {
          mutation.mutate("1");
        }}
      >
        发送请求
      </Button>

      {user && (
        <div>
          <p>{user.id}</p>
          <p>{user.username}</p>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      )}
    </>
  );
}
