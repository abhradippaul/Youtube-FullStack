"use client";

import { Button } from "@/components/ui/button";
import {
  getCategoriesList,
  getStudioVideo,
  updateUserStudioVideo,
} from "@/lib/api-calls";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@/providers/get-query-client";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  visibility: z.boolean(),
});

const ExtraSchema = z.object({
  id: z.string(),
  userId: z.string(),
  duration: z.number().nullable().optional(),
  muxStatus: z.string().nullable().optional(),
  muxAssetId: z.string().nullable().optional(),
  muxUploadId: z.string().nullable().optional(),
  muxPlaybackId: z.string().nullable().optional(),
  muxTrackId: z.string().nullable().optional(),
  muxTrackStatus: z.string().nullable().optional(),
  createdAt: z.union([z.string(), z.date()]).nullable().optional(),
  updatedAt: z.union([z.string(), z.date()]).nullable().optional(),
});

const ExtraResponse = formSchema.merge(ExtraSchema);

export type StudioVideoResponseSchema = z.infer<typeof ExtraResponse>;

interface FormSectionProps {
  videoId: string;
  sessionId: string;
  formData: z.infer<typeof ExtraResponse>;
}

function FormSection({ videoId, sessionId, formData }: FormSectionProps) {
  const queryClient = useQueryClient();

  const { data: categoriesList, isLoading: categoryLoading } = useQuery({
    queryKey: ["categoriesList"],
    queryFn: () => getCategoriesList(sessionId),
    enabled: Boolean(sessionId),
  });

  const videoUpdateMutation = useMutation(
    {
      mutationFn: (variable: {
        values: z.infer<typeof formSchema>;
        sessionId: string;
        videoId: string;
      }) =>
        updateUserStudioVideo(
          variable.sessionId,
          variable.videoId,
          variable.values
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["studio-video", videoId] });
        toast("Video updated successfully");
      },
      onError: (err) => {
        console.log(err);
        toast("Video update unsuccessful");
      },
    },
    queryClient
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formData?.title,
      description: formData?.description,
      categoryId: formData?.categoryId,
      visibility: formData?.visibility,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // mutation.mutate({
    //   values,
    //   sessionId,
    //   videoId,
    // });
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Video details</h1>
            <h1 className="text-xs text-muted-foreground">
              Manage your video details
            </h1>
          </div>
          <div className="flex items-center gap-x-2">
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={videoUpdateMutation.isPending}
            >
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <TrashIcon className="size-4 mr-2" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="space-y-8 lg:col-span-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add a title to your video"
                      {...field}
                      value={field?.value ?? ""}
                      disabled={videoUpdateMutation.isPending}
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
                    <Textarea
                      {...field}
                      value={field?.value ?? ""}
                      rows={10}
                      className="resize-none pr-10"
                      placeholder="Add a description to your video"
                      disabled={videoUpdateMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                      disabled={
                        categoryLoading || videoUpdateMutation.isPending
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesList?.data?.categoryList?.map(
                          ({ id, name }) => (
                            <SelectItem value={id} key={id}>
                              {name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}

export default FormSection;
