"use client";

import { useQuery } from "@tanstack/react-query";
import FormSection from "../sections/form-section";
import { getStudioVideo } from "@/lib/api-calls";

interface VideoViewProps {
  videoId: string;
  sessionId: string;
}

function VideoView({ videoId, sessionId }: VideoViewProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["studio-video", videoId],
    queryFn: () => getStudioVideo(sessionId!, videoId),
    enabled: Boolean(sessionId),
  });

  if (isLoading) return <p>Loading....</p>;

  if (!data) return null;

  return (
    <div className="px-4 pt-2.5 max-w-screen w-full">
      <FormSection
        videoId={videoId}
        sessionId={sessionId}
        formData={data?.data.video[0]}
      />
    </div>
  );
}

export default VideoView;
