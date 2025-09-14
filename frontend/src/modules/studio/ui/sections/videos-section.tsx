"use client";

import InfiniteScroll from "@/components/infinite-scroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

function VideosSection() {
  const items = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));
  type Item = (typeof items)[0];

  const limit = 10;

  async function fetchData({ pageParam }: { pageParam: number }): Promise<{
    data: { items: Item[]; nextCursor: number | null };
  }> {
    console.log("Page param", pageParam);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({
    //       data: items.slice(pageParam, pageParam + 15),
    //       currentPage: pageParam,
    //       nextPage: pageParam + 15 < items.length ? pageParam + 15 : null,
    //     });
    //   }, 1000);
    // });
    return await axios.get(
      `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/studio/videos?pageParam=${pageParam}&limit=${limit}`
    );
  }

  const {
    data,
    error,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: fetchData,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });

  console.log(data);

  return status === "pending" ? (
    <div>Loading...</div>
  ) : status === "error" ? (
    <div>{error.message}</div>
  ) : (
    <div className="">
      {/* {data?.pages?.map((page) => {
        return (
          <div key={page.data.currentPage} className="flex flex-col gap-2">
            {page?.data?.items?.map(({ id, name }) => (
              <div className="p-4 rounded-md bg-gray-500" key={id}>
                {name}
              </div>
            ))}
          </div>
        );
      })} */}
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
              data?.items?.map(({ id, name }) => (
                <Link href={`/video/studio/${id}`} key={id} legacyBehavior>
                  <TableRow className="cursor-pointer">
                    <TableCell>{name}</TableCell>
                    <TableCell>Visibility</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Views</TableCell>
                    <TableCell>Comments</TableCell>
                    <TableCell>Likes</TableCell>
                  </TableRow>
                </Link>
              ))
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
