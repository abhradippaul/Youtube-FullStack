"use client";

import { getVideo } from "@/lib/api-calls";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import VideoPlayer from "../components/video-player";
import VideoBanner from "../components/video-banner";
import VideoTopRow from "../components/video-top-row";

interface VideoSectionProps {
  videoId: string;
}

function VideoSection({ videoId }: VideoSectionProps) {
  const {
    data: videoData,
    error: videoError,
    isLoading: videoLoading,
  } = useQuery({
    queryFn: () => getVideo(videoId),
    queryKey: ["video", videoId],
    enabled: Boolean(videoId),
  });

  const videoInfo = videoData?.data.videoInfo;

  if (videoLoading) return null;

  if (videoError) return <h1>Error while loading video</h1>;

  if (!videoInfo?.length) return <h1>Video not found</h1>;

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          videoInfo[0].muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={() => {}}
          playbackId={videoInfo[0].playbackId}
        />
      </div>
      <VideoBanner />
      {videoData?.data && <VideoTopRow videoInfo={videoInfo[0]} />}
    </>
  );
}

export default VideoSection;
