import { GetVideoInfo } from "@/lib/api-calls";
import VideoOwner from "./video-owner";
import VideoReaction from "./video-reaction";
import VideoMenu from "./video-menu";
import VideoDescription from "./video-description";

interface VideoTopRowProps {
  videoInfo: GetVideoInfo;
}

function VideoTopRow({ videoInfo }: VideoTopRowProps) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">{videoInfo.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwner videoOwnerInfo={videoInfo.owner} videoId={videoInfo.id} />
        <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
          <VideoReaction />
          <VideoMenu videoId={videoInfo.id} variant="secondary" />
        </div>
      </div>

      <VideoDescription
        description={videoInfo.descriptions}
        compactViews="0"
        expandedViews="0"
        compactDate="22/22/22"
        expandedDate="12th jan 2025"
      />
    </div>
  );
}

export default VideoTopRow;
