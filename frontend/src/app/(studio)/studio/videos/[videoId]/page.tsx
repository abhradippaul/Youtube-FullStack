import VideoView from "@/modules/studio/ui/views/video-view";
import { auth } from "@clerk/nextjs/server";

interface PageParams {
  params: {
    videoId: string;
  };
}

async function page({ params }: PageParams) {
  const { sessionId } = await auth();
  const { videoId } = await params;
  if (!sessionId || !videoId) return null;
  return <VideoView videoId={videoId} sessionId={sessionId} />;
}

export default page;
