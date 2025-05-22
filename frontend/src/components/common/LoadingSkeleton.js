import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const ChatSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-start space-x-3">
        <Skeleton circle width={40} height={40} />
        <div className="flex-1">
          <Skeleton width={100} />
          <Skeleton count={2} />
        </div>
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton circle width={80} height={80} />
      <div className="flex-1">
        <Skeleton width={200} />
        <Skeleton width={150} />
      </div>
    </div>
    <Skeleton count={3} />
  </div>
);

export const MatchSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="card">
        <div className="flex items-center space-x-3">
          <Skeleton circle width={50} height={50} />
          <div className="flex-1">
            <Skeleton width={120} />
            <Skeleton width={80} />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton count={2} />
        </div>
      </div>
    ))}
  </div>
); 