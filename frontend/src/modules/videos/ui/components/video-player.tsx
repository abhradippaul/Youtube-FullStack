import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId?: string | null;
  autoPlay?: boolean;
  onPlay?: () => void;
}

const MUX_IMAGE_URL = process.env.NEXT_PUBLIC_MUX_IMAGE_URL!;

function VideoPlayer({ autoPlay, onPlay, playbackId }: VideoPlayerProps) {
  console.log(`${MUX_IMAGE_URL}/${playbackId}/thumbnail.jpg`);
  if (!playbackId) return null;
  return (
    <MuxPlayer
      playbackId={playbackId}
      poster={`${MUX_IMAGE_URL}/${playbackId}/thumbnail.jpg`}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className="size-full object-contain"
      accentColor="#FF2056"
    />
  );
}

export default VideoPlayer;
