import { useState } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import VideoPlayer from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CopyCheckIcon, CopyIcon, Globe2Icon, LockIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoStatusSectionProps {
  muxPlaybackId: string;
  videoId: string;
  muxStatus: string;
  muxTrackStatus: string;
  control: Control<
    {
      title: string;
      visibility: string;
      description?: string | null | undefined;
      categoryId?: string | null | undefined;
    },
    any,
    {
      title: string;
      visibility: string;
      description?: string | null | undefined;
      categoryId?: string | null | undefined;
    }
  >;
}

const fullUrl = "localhost:3000";

const visibilityList = [
  {
    id: "public",
    name: "public",
    icon: Globe2Icon,
  },
  {
    id: "private",
    name: "Private",
    icon: LockIcon,
  },
];

function VideoStatusSection({
  muxPlaybackId,
  muxStatus,
  muxTrackStatus,
  videoId,
  control,
}: VideoStatusSectionProps) {
  const [isCopied, setIsCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(`${fullUrl}/videos/${videoId}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <div className="flex flex-col gap-y-8 lg:col-span-2">
      <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
        <div className="aspect-video overflow-hidden relative">
          <VideoPlayer autoPlay={false} playbackId={muxPlaybackId} />
        </div>
        <div className="p-4 flex flex-col gap-y-6">
          <div className="flex justify-between items-center gap-x-2">
            <div className="flex flex-col gap-y-1">
              <p className="text-muted-foreground text-xs">Video link</p>
              <div className="flex items-center gap-x-2">
                <Link href={`/videos/${videoId}`}>
                  <p className="line-clamp-1 text-blue-500">localhost</p>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={onCopy}
                  disabled={isCopied}
                >
                  {" "}
                  {isCopied ? <CopyCheckIcon /> : <CopyIcon />}{" "}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <p className="text-muted-foreground text-xs">Video status</p>
              <p className="text-xs">{muxStatus}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <p className="text-muted-foreground text-xs">Subtitles status</p>
              <p className="text-xs">{muxTrackStatus}</p>
            </div>
          </div>
        </div>
      </div>
      <FormField
        control={control}
        name="visibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visibility</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  {visibilityList.map(({ id, name, icon: Icon }) => (
                    <SelectItem value={id} key={id}>
                      <div className="flex items-center">
                        <Icon className="size-4 mr-2" /> {name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default VideoStatusSection;
