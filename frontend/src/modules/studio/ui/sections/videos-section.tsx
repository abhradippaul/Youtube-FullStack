"use client";

import InfiniteScroll from "@/components/infinite-scroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { getStudioVideos } from "@/lib/api-calls";
import { useAuth } from "@clerk/nextjs";
import VideoThumbnail from "@/modules/videos/ui/components/video-thumbnail";
import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function VideosSection() {
  const { sessionId } = useAuth();

  const {
    data,
    error,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["studio-videos"],
    queryFn: ({ pageParam }) => getStudioVideos(sessionId!, pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    enabled: Boolean(sessionId),
  });

  console.log(sessionId);

  return status === "pending" ? (
    <>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-36" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  ) : status === "error" ? (
    <div>{error.message}</div>
  ) : (
    <div className="">
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.map(({ data }) =>
              data?.items?.map(
                ({
                  id,
                  muxPlaybackId,
                  duration,
                  title,
                  description,
                  muxStatus,
                  createdAt,
                  visibility,
                }) => (
                  <Link href={`/studio/videos/${id}`} key={id} legacyBehavior>
                    <TableRow className="cursor-pointer">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="relative aspect-video w-36 shrink-0">
                            <VideoThumbnail
                              playbackId={muxPlaybackId}
                              duration={duration || 0}
                            />
                          </div>
                          <div className="flex flex-col overflow-hidden gap-y-1">
                            <span className="text-sm line-clamp-1">
                              {title}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {description || "No description"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {visibility === "private" ? (
                            <LockIcon className="size-4 mr-2" />
                          ) : (
                            <Globe2Icon className="size-4 mr-2" />
                          )}
                          {visibility}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">{muxStatus}</div>
                      </TableCell>
                      <TableCell className="text-sm truncate">
                        {format(new Date(createdAt || ""), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        Views
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        Comments
                      </TableCell>
                      <TableCell className="text-right text-sm pr-6">
                        Likes
                      </TableCell>
                    </TableRow>
                  </Link>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
}

export default VideosSection;
