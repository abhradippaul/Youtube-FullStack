import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface VideoMenuProps {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

function VideoMenu({ videoId, onRemove, variant }: VideoMenuProps) {
  const pathname = usePathname();
  const onShare = () => {
    const fullUrl = `${pathname}/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copeid to the clipboard");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="rounded-full">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenuLabel onClick={onShare}>
          <ShareIcon className="mr-2 size-4" /> Share
        </DropdownMenuLabel>
        <DropdownMenuLabel onClick={() => {}}>
          <ListPlusIcon className="mr-2 size-4" /> Add to playlist
        </DropdownMenuLabel>
        {onRemove && (
          <DropdownMenuLabel onClick={() => {}}>
            <Trash2Icon className="mr-2 size-4" /> Remove
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default VideoMenu;
