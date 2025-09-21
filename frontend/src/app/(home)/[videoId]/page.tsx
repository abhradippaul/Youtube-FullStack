import VideoView from "@/modules/videos/ui/components/video-view";

interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
}

async function page({ params }: PageProps) {
  const { videoId } = await params;
  return <VideoView videoId={videoId} />;
}

export default page;
