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

function StudioUploadModal() {
  const [open, setOpen] = useState(false);
  const [isFormUpdated, setIsFormUpdated] = useState(false);
  const { sessionId } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["upload_url"],
    queryFn: () => getMuxUploadUrl(sessionId!),
    enabled: false,
  });

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
            onSuccess={() => {
              setIsFormUpdated(false);
              setOpen(false);
            }}
          />
        )}
        {data?.data?.upload_id && !isFormUpdated && (
          <VideoUploadForm
            sessionId={sessionId!}
            uploadId={data?.data?.upload_id}
            onSuccess={() => {
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
