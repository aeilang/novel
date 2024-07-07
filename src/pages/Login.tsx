import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, useAuth } from "@/lib/auth";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchma = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(20),
});

type LoginPayload = z.infer<typeof formSchma>;

export default function Login() {
  const form = useForm<LoginPayload>({
    resolver: zodResolver(formSchma),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (formData: LoginPayload) => {
      return api.post("/login", formData).then((resp) => resp.data);
    },
    onSuccess: (data) => {
      const user: User = {
        userId: data.user_id,
        role: data.role,
        token: data.token,
      };
      setUser(user);
      navigate("/", { replace: true });
    },
  });

  const onSubmit = (values: LoginPayload) => {
    mutation.mutate(values);
  };

  return (
    <main className=" h-screen flex  flex-col justify-center max-w-md mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col shadow-md space-y-7 p-8"
        >
          <h2 className=" font-bold text-3xl text-center">登录</h2>
          {mutation.isError && (
            <p className=" text-sm text-red-600">
              邮箱或密码错误
              <span
                onClick={() => {
                  mutation.reset();
                }}
              >
                请重试
              </span>
            </p>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {mutation.isPending ? (
              <Loader className=" animate-spin" />
            ) : (
              <p>登录</p>
            )}
          </Button>

          <div className="flex justify-between">
            <Link to="/signup" className=" text-sm text-sky-500">
              还有没账号? 去注册
            </Link>
            <Link to="/forget" className="text-sm text-sky-500">
              忘记密码?
            </Link>
          </div>
        </form>
      </Form>
    </main>
  );
}
