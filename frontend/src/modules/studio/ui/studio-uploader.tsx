import { Button } from "@/components/ui/button";
import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { UploadIcon } from "lucide-react";

interface StudioUploaderProps {
  endpoint: string;
  onSuccess: () => void;
}

const uploaderId = "video-uploader";

function StudioUploader({ onSuccess, endpoint }: StudioUploaderProps) {
  return (
    <div>
      <MuxUploader
        endpoint={endpoint}
        onSuccess={onSuccess}
        id={uploaderId}
        className="hidden group/uploader"
      />
      <MuxUploaderDrop muxUploader={uploaderId} className="group/drop">
        <div className="flex flex-col items-center gap-6" slot="heading">
          <div className="flex items-center justify-center gap-2 rounded-full bg-muted size-32">
            <UploadIcon className="size-10 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm">Drag and drop video file to upload</p>
            <p className="text-xs text-muted-foreground">
              Your videos will be private untill you publish them
            </p>
          </div>
          <MuxUploaderFileSelect muxUploader={uploaderId}>
            <Button type="button" className="rounded-full">
              Select files
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separetor" className="hidden" />
        <MuxUploaderStatus muxUploader={uploaderId} className="text-xs" />
        <MuxUploaderProgress
          muxUploader={uploaderId}
          className="text-xs"
          type="percentage"
        />
        <MuxUploaderProgress muxUploader={uploaderId} type="bar" />
      </MuxUploaderDrop>
    </div>
  );
}

export default StudioUploader;
