"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

function StudioUploadModal() {
  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={false}
        onOpenChange={() => {}}
      >
        <p>This will be an uploader</p>
      </ResponsiveModal>
      <Button variant="secondary" className="cursor-pointer">
        <PlusIcon /> Create
      </Button>
    </>
  );
}

export default StudioUploadModal;
