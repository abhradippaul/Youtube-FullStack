import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

interface VideoReactionProps {}

function VideoReaction() {
  const isLiked = true;
  const isDisliked = false;
  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4
    "
      >
        {" "}
        <ThumbsUpIcon
          className={cn("size-5", isLiked && !isDisliked && "fill-black")}
        />
        {1}
      </Button>{" "}
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3
    "
      >
        {" "}
        <ThumbsDownIcon
          className={cn("size-5", isDisliked && !isLiked && "fill-black")}
        />
        {1}
      </Button>
    </div>
  );
}

export default VideoReaction;
