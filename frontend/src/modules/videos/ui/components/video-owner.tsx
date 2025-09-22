import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import {
  addToSubscribeList,
  GetVideoOwnerInfo,
  removeFromSubscribeList,
} from "@/lib/api-calls";
import SubscriptionButton from "@/modules/subscriptions/ui/components/subscriptoin-button";
import UserInfo from "@/modules/users/ui/components/user-info";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

interface VideoOwnerProps {
  videoOwnerInfo: GetVideoOwnerInfo;
  videoId: string;
}

function VideoOwner({ videoOwnerInfo, videoId }: VideoOwnerProps) {
  const { userId, sessionId } = useAuth();
  const userAddSubscriptionMutation = useMutation({
    mutationFn: () =>
      addToSubscribeList(sessionId || "", videoOwnerInfo.id || ""),
  });

  const userRemoveSubscriptionMutation = useMutation({
    mutationFn: () =>
      removeFromSubscribeList(sessionId || "", videoOwnerInfo.id || ""),
  });
  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link href={`/users/${videoOwnerInfo.id}`}>
        <div className="flex items-center gap-3  min-w-0">
          <UserAvatar
            size="lg"
            imageUrl={videoOwnerInfo.avatarUrl || ""}
            name={videoOwnerInfo.name}
            onClick={() => {}}
          />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo name={videoOwnerInfo.name} size="lg" />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {videoOwnerInfo.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>
      {userId === videoOwnerInfo.clerkId ? (
        <Button className="rounded-full" asChild variant="secondary">
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          disabled={
            userRemoveSubscriptionMutation.isPending ||
            userAddSubscriptionMutation.isPending
          }
          isSubscribed={videoOwnerInfo.isSubscribed}
          onClick={() => {
            if (sessionId && videoOwnerInfo.id) {
              if (videoOwnerInfo.isSubscribed) {
                userRemoveSubscriptionMutation.mutate();
              } else {
                userAddSubscriptionMutation.mutate();
              }
            }
          }}
          className="flex-none"
        />
      )}
    </div>
  );
}

export default VideoOwner;
