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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";

const Schema = z
  .object({
    email: z.string().email(),
    verifi_code: z.string().length(4),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
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

type ForgetPayload = z.infer<typeof Schema>;

export default function ForgetPassword() {
  const [count, setCount] = useState(60);

  const form = useForm<ForgetPayload>({
    resolver: zodResolver(Schema),
    defaultValues: {
      email: "",
      verifi_code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (formData: ForgetPayload) => {
      return api.post("/forget", {
        email: formData.email,
        new_password: formData.password,
        verifi_code: formData.verifi_code,
      });
    },

    onSuccess: () => {
      navigate("/login");
    },
  });

  const onSubmit = (formData: ForgetPayload) => {
    mutation.mutate(formData);
  };

  const sendCodeMuta = useMutation({
    mutationFn: (formData: Pick<ForgetPayload, "email">) => {
      return api.post("/verify", {
        email: formData.email,
      });
    },
    onSuccess: () => {
      const timer = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        setCount(60);
      }, 60 * 1000);
    },
  });

  const handleSendCode = async () => {
    const output = await form.trigger("email", { shouldFocus: true });

    if (!output) {
      return;
    }
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
            <h3 className=" text-3xl font-bold text-center">更改密码</h3>

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
                  <div className="flex">
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    {count === 60 ? (
                      <Button
                        type="button"
                        variant="link"
                        className=" text-sky-500"
                        onClick={handleSendCode}
                        disabled={sendCodeMuta.isPending}
                      >
                        {sendCodeMuta.isPending ? (
                          <Loader2 className=" animate-spin w-10" />
                        ) : (
                          <p>发送验证码</p>
                        )}
                      </Button>
                    ) : (
                      <p className="flex ml-10 mr-2 w-10 items-center">
                        {count} s
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className=" animate-spin" />
              ) : (
                <p>更改</p>
              )}
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
}
