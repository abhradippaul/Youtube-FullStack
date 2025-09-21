import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { AxiosError } from "axios";
import { createVideo } from "@/lib/api-calls";

interface VideoUploadFormProps {
  sessionId: string;
  uploadId: string;
  onSuccess: (videoId: string) => void;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
});

function VideoUploadForm({
  sessionId,
  uploadId,
  onSuccess,
}: VideoUploadFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (body: z.infer<typeof formSchema>) =>
      createVideo(sessionId, { ...body, uploadId }),
    onSuccess: (data) => {
      if (data.data.videoId) {
        onSuccess(data.data.videoId);
      }
      toast("Form successfully submitted");
    },
    onError: (err: AxiosError) => {
      console.log(err);
      const msg = err?.response?.data as { msg: string };
      toast(msg.msg);
    },
  });

  const onSubmit = async (body: z.infer<typeof formSchema>) => {
    mutation.mutate(body);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full mx-auto"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Write title here"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Write description here"
                  {...field}
                  disabled={mutation.isPending}
                />
              </FormControl>
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

export default VideoUploadForm;
