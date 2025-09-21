"use client";

import { Button } from "@/components/ui/button";

import {
  deleteUserStudioVideo,
  getCategoriesList,
  updateUserStudioVideo,
} from "@/lib/api-calls";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Loader2, MoreVerticalIcon, TrashIcon } from "lucide-react";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@/providers/get-query-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import VideoStatusSection from "./video-status-section";

const formSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  visibility: z.string(),
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
  videoInfo: z.infer<typeof ExtraResponse>;
}

function FormSection({ videoId, sessionId, videoInfo }: FormSectionProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: categoriesList, isLoading: categoryLoading } = useQuery({
    queryKey: ["categoriesList"],
    queryFn: () => getCategoriesList(sessionId),
    enabled: Boolean(sessionId),
  });

  const videoUpdateMutation = useMutation(
    {
      mutationFn: (values: z.infer<typeof formSchema>) =>
        updateUserStudioVideo(sessionId, videoId, values),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["studio-video", videoId] });
        queryClient.invalidateQueries({ queryKey: ["studio-videos"] });
        toast.success("Video updated successfully");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Some thing went wrong");
      },
    },
    queryClient
  );

  const videoDeleteMutation = useMutation({
    mutationFn: () => deleteUserStudioVideo(sessionId, videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-videos"] });
      toast.success("Video deleted successfully");
      router.replace("/studio");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Some thing went wrong");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: videoInfo?.title || "",
      description: videoInfo?.description || "",
      categoryId: videoInfo?.categoryId || "",
      visibility: videoInfo?.visibility,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (
      values.title != videoInfo.title ||
      values.description != videoInfo.description ||
      values.categoryId !== videoInfo.categoryId ||
      values.visibility != values.visibility
    ) {
      if (values.title) {
        videoUpdateMutation.mutate(values);
      }
    } else {
      toast.error("Values are not changed");
    }
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
              {videoUpdateMutation.isPending && (
                <Loader2 className="size-4  animate-spin" />
              )}
              Save
            </Button>
            <Button
              type="button"
              className="cursor-pointer"
              variant="destructive"
              disabled={videoUpdateMutation.isPending}
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => videoDeleteMutation.mutate()}>
                  <TrashIcon className="size-4 mr-2" />
                  Delete
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
                      // value={field?.value ?? ""}
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
                      <SelectTrigger className="w-full">
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

          {videoInfo.muxPlaybackId && (
            <VideoStatusSection
              muxPlaybackId={videoInfo.muxPlaybackId}
              muxStatus={videoInfo.muxStatus || "preparing"}
              muxTrackStatus={videoInfo.muxTrackStatus || "no_subtitles"}
              videoId={videoInfo.id}
              control={form.control}
            />
          )}
        </div>
      </form>
    </Form>
  );
}

export default FormSection;
