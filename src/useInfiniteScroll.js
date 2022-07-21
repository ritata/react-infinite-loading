import { useEffect, useCallback } from "react";
import { morePage } from "./constants";

// infinite scrolling with intersection observer
export default function useInfiniteScroll(scrollRef, dispatch, fetching) {
  const scrollObserver = useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.intersectionRatio > 0) {
            dispatch({ type: morePage });
          }
        });
      }).observe(node);
    },
    [dispatch]
  );

  useEffect(() => {
    if (scrollRef.current && fetching === false) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef, fetching]);
}
