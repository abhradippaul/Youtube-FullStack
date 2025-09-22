import { GetVideoInfo } from "@/lib/api-calls";
import VideoOwner from "./video-owner";
import VideoReaction from "./video-reaction";
import VideoMenu from "./video-menu";
import VideoDescription from "./video-description";
import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoTopRowProps {
  videoInfo: GetVideoInfo;
  sessionId: null | string;
}

export const VideoTopRowSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-4/5 md:w-2/5" />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 w-[70%]">
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-5 w-4/5 md:w-2/6" />
            <Skeleton className="h-5 w-3/5 md:w-1/5" />
            <Skeleton />
          </div>
        </div>
        <Skeleton className="h-9 w-2/6 md:w-1/6 rounded-full" />
      </div>
      <div className="h-[120px] w-full"></div>
    </div>
  );
};

function VideoTopRow({ videoInfo, sessionId }: VideoTopRowProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(videoInfo.viewCount);
  }, []);

  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "standard",
    }).format(videoInfo.viewCount);
  }, []);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(videoInfo.createdAt, { addSuffix: true });
  }, [videoInfo.createdAt]);

  const expandedDate = useMemo(() => {
    return format(videoInfo.createdAt, "d MMM yyyy");
  }, [videoInfo.createdAt]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">{videoInfo.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwner videoOwnerInfo={videoInfo.owner} videoId={videoInfo.id} />
        <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
          <VideoReaction
            videoId={videoInfo.id}
            likes={videoInfo.likeCount}
            dislike={videoInfo.disLikeCount}
            videoReaction={videoInfo.videoReaction}
            sessionId={sessionId}
          />
          <VideoMenu videoId={videoInfo.id} variant="secondary" />
        </div>
      </div>

      <VideoDescription
        description={videoInfo.descriptions}
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandedDate={expandedDate}
      />
    </div>
  );
}

export default VideoTopRow;
