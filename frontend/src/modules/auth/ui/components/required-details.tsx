"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.email(),
});

function RequiredDetails() {
  const { user, isLoaded, isSignedIn } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (body: z.infer<typeof formSchema>) => {
      const response = await axios.post(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      // QueryClient.invalidateQueries({ queryKey: ['todos'] })
      toast("Form successfully submitted");
    },
    onError: (err: AxiosError) => {
      console.log(err);
      const msg = err?.response?.data as { msg: string };
      toast(msg.msg);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const body = {
      ...values,
      clerkId: user?.id,
    };
    mutation.mutate(body);
  }

  useEffect(() => {
    form.setValue("name", user?.fullName || "");
    form.setValue("email", user?.emailAddresses[0].emailAddress || "");
  }, [user?.fullName]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[500px] mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fullname</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                  disabled={mutation.isPending}
                />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="abc@xyz.com"
                  {...field}
                  disabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="jondoe"
                  {...field}
                  disabled={mutation.isPending}
                />
              </FormControl>
              <FormDescription>The username must be unique</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="cursor-pointer"
          disabled={mutation.isPending}
        >
          {mutation.isPending && (
            <Loader2Icon size="8px" className="animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default RequiredDetails;
