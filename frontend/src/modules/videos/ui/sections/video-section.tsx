"use client";

import { createVideoView, getVideo } from "@/lib/api-calls";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import VideoPlayer, { VideoPlayerSkeleton } from "../components/video-player";
import VideoBanner from "../components/video-banner";
import VideoTopRow, { VideoTopRowSkeleton } from "../components/video-top-row";

interface VideoSectionProps {
  videoId: string;
  sessionId: string | null;
}

export const VideoSectionSkeleton = () => {
  return (
    <>
      <VideoPlayerSkeleton />
      <VideoTopRowSkeleton />
    </>
  );
};

function VideoSection({ videoId, sessionId }: VideoSectionProps) {
  const {
    data: videoData,
    error: videoError,
    isLoading: videoLoading,
  } = useQuery({
    queryFn: () => getVideo(videoId),
    queryKey: ["video", videoId],
    enabled: Boolean(videoId),
  });

  console.log(sessionId);

  const { refetch: refetchVideoView } = useQuery({
    queryFn: () => createVideoView(sessionId || "", videoId),
    queryKey: ["video-view", videoId],
    enabled: false,
  });

  const handlePlay = () => {
    if (sessionId && videoId) {
      refetchVideoView();
    }
  };

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
          onPlay={handlePlay}
          playbackId={videoInfo[0].muxPlaybackId}
        />
      </div>
      <VideoBanner muxStatus={videoInfo[0].muxStatus} />
      {videoData?.data && (
        <VideoTopRow videoInfo={videoInfo[0]} sessionId={sessionId} />
      )}
    </>
  );
}

export default VideoSection;
