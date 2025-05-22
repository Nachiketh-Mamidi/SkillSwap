import React from 'react';
import { useInView } from 'react-intersection-observer';

export const InfiniteScroll = ({ children, onLoadMore, hasMore, loading }) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  React.useEffect(() => {
    if (inView && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  return (
    <div className="space-y-4">
      {children}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-4">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          ) : (
            <div className="h-8" />
          )}
        </div>
      )}
    </div>
  );
}; 