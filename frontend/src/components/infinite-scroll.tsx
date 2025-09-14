import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "./ui/button";

interface InfiniteScrollProps {
  isMannual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

function InfiniteScroll({
  isMannual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteScrollProps) {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isMannual) {
      console.log("Next fetch calling");
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div ref={ref} className="h-1" />
      {hasNextPage ? (
        <Button
          className="cursor-pointer"
          variant="secondary"
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading.." : "Load more"}
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          You have reached the end of the list
        </p>
      )}
    </div>
  );
}

export default InfiniteScroll;
