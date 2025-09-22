import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  toggleDislikeVideoReaction,
  toggleLikeVideoReaction,
} from "@/lib/api-calls";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";

interface VideoReactionProps {
  videoId: string;
  likes: number;
  dislike: number;
  videoReaction: undefined | string;
  sessionId: string | null;
}

function VideoReaction({
  dislike,
  likes,
  videoId,
  videoReaction,
  sessionId,
}: VideoReactionProps) {
  const toggleLikeMutate = useMutation({
    mutationFn: () => toggleLikeVideoReaction(sessionId || "", videoId),
    onSuccess: () => {
      toast.success("Successfully liked the video");
    },
    onError: () => {
      toast.success("Error like video");
    },
  });

  const toggleDislikeMutate = useMutation({
    mutationFn: () => toggleDislikeVideoReaction(sessionId || "", videoId),
    onSuccess: () => {
      toast.success("Successfully unliked the video");
    },
    onError: () => {
      toast.success("Error like video");
    },
  });

  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        onClick={() => {
          if (sessionId && videoId) {
            toggleLikeMutate.mutate();
          }
        }}
      >
        <ThumbsUpIcon
          className={cn("size-5", videoReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
        onClick={() => {
          if (sessionId && videoId) {
            toggleDislikeMutate.mutate();
          }
        }}
      >
        <ThumbsDownIcon
          className={cn("size-5", videoReaction === "dislike" && "fill-black")}
        />
        {dislike}
      </Button>
    </div>
  );
}

export default VideoReaction;
