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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const formShema = z
  .object({
    username: z.string().min(2).max(20),
    email: z.string().email(),
    password: z.string().min(5).max(20),
    confirmPassword: z.string(),
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

export default function Signup() {
  const form = useForm<SignupPayload>({
    resolver: zodResolver(formShema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (formData: SignupPayload) => {
      return api.post("/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  const onSubmit = (formData: SignupPayload) => {
    mutation.mutate(formData);
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
            {mutation.isError && (
              <p
                onClick={() => {
                  mutation.reset();
                }}
                className=" text-sm text-red-500"
              >
                {mutation.error.message} 请重试
              </p>
            )}

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
