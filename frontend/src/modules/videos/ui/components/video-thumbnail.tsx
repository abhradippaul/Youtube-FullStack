import { formatDuration } from "@/lib/utils";
import Image from "next/image";

interface VideoThumbnailProps {
  playbackId?: string | null;
  title?: string | null;
  duration: number;
}

const MUX_IMAGE_URL = process.env.NEXT_PUBLIC_MUX_IMAGE_URL!;

function VideoThumbnail({ playbackId, title, duration }: VideoThumbnailProps) {
  return (
    <div className="relative group">
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={
            playbackId
              ? `${MUX_IMAGE_URL}/${playbackId}/thumbnail.jpg`
              : "/placeholder.svg"
          }
          alt={title ?? "Thumbnail"}
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          src={
            playbackId
              ? `${MUX_IMAGE_URL}/${playbackId}/animated.gif`
              : "/placeholder.svg"
          }
          unoptimized={!!playbackId}
          alt={title ?? "Thumbnail"}
          fill
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/100 text-white text-xs font-medium">
        {formatDuration(duration)}
      </div>
    </div>
  );
}

export default VideoThumbnail;
