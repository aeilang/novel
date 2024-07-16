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
import { api } from "@/lib/axios";
import { useAuth } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const formShema = z
  .object({
    username: z.string().min(2).max(20),
    email: z.string().email(),
    password: z.string().min(5).max(20),
    confirmPassword: z.string(),
    verifi_code: z.string().length(4),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      path: ["confirmPassword"],
      message: "两次密码不相同",
    }
  );

type SignupPayload = z.infer<typeof formShema>;

export function Signup() {
  const [count, setCount] = useState(60);

  const { login } = useAuth();

  const form = useForm<SignupPayload>({
    resolver: zodResolver(formShema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      verifi_code: "",
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (formData: SignupPayload) => {
      return api
        .post("/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          verifi_code: formData.verifi_code,
        })
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      login({
        accessToken: data?.access_token,
        refreshToken: data?.refresh_token,
      });
      navigate("/", { replace: true });
    },
  });

  const onSubmit = (formData: SignupPayload) => {
    mutation.mutate(formData);
  };

  const sendCodeMuta = useMutation({
    mutationFn: (formData: Pick<SignupPayload, "email">) => {
      return api.post("/verify", {
        email: formData.email,
      });
    },
  });

  const startCount = () => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      setCount(60);
    }, 60 * 1000);
  };

  const handleSendCode = async () => {
    const output = await form.trigger("email", { shouldFocus: true });

    if (!output) {
      return;
    }

    startCount();
    const email = form.getValues("email");
    sendCodeMuta.mutate({ email: email });
  };

  return (
    <>
      <main className="flex flex-col h-screen justify-center max-w-md mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-5 shadow-md p-8"
          >
            <h3 className=" text-3xl font-bold text-center">注册</h3>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verifi_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>验证码</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {count === 60 ? (
                        <Button
                          type="button"
                          variant="link"
                          className=" text-sky-500"
                          onClick={handleSendCode}
                          disabled={sendCodeMuta.isPending}
                        >
                          <p>发送验证码</p>
                        </Button>
                      ) : (
                        <p className="flex ml-10 mr-2 w-10 items-center">
                          {count} s
                        </p>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader className=" animate-spin" />
              ) : (
                <p>注册</p>
              )}
            </Button>

            <Link to={"/login"} className=" text-sm text-sky-500">
              已有账号，去登录
            </Link>
          </form>
        </Form>
      </main>
    </>
  );
}
