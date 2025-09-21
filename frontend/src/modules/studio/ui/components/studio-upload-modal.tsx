"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { getMuxUploadUrl } from "@/lib/api-calls";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import StudioUploader from "../studio-uploader";
import VideoUploadForm from "./videoupload-form";
import { useQueryClient } from "@/providers/get-query-client";
import { useRouter } from "next/navigation";

function StudioUploadModal() {
  const [open, setOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [isFormUpdated, setIsFormUpdated] = useState(false);
  const { sessionId } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["upload_url"],
    queryFn: () => getMuxUploadUrl(sessionId!),
    enabled: false,
  });

  const onSuccess = () => {
    if (!videoId) return;

    queryClient.invalidateQueries({ queryKey: ["studio-videos"] });
    setIsFormUpdated(false);
    setOpen(false);
    router.push(`/studio/videos/${videoId}`);
  };

  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={open}
        onOpenChange={() => {
          if (!isFormUpdated) {
            setOpen(false);
          }
        }}
      >
        {!isLoading && isFormUpdated && data?.data?.upload_url && (
          <StudioUploader
            endpoint={data?.data?.upload_url}
            onSuccess={onSuccess}
          />
        )}
        {data?.data?.upload_id && !isFormUpdated && (
          <VideoUploadForm
            sessionId={sessionId!}
            uploadId={data?.data?.upload_id}
            onSuccess={(videoId: string) => {
              setVideoId(videoId);
              setIsFormUpdated(true);
            }}
          />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        className="cursor-pointer"
        onClick={() => {
          refetch();
          setOpen(true);
        }}
        disabled={isLoading}
      >
        {isLoading ? <Loader2Icon /> : <PlusIcon />} Create
      </Button>
    </>
  );
}

export default StudioUploadModal;
