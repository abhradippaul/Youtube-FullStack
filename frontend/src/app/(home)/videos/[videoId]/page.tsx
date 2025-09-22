import VideoView from "@/modules/videos/ui/components/video-view";
import { auth } from "@clerk/nextjs/server";

interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
}

async function page({ params }: PageProps) {
  const { videoId } = await params;
  const { sessionId } = await auth();
  return <VideoView videoId={videoId} sessionId={sessionId} />;
}

export default page;
