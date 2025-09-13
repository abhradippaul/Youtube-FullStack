"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

function StudioUploadModal() {
  return (
    <Button variant="secondary" className="cursor-pointer">
      <PlusIcon /> Create
    </Button>
  );
}

export default StudioUploadModal;
