import React from "react";
import clsx from "clsx";

export function Skeleton({ className }) {
  return <div aria-hidden="true" className={clsx("shimmer rounded-lg", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-xl2 p-6 space-y-4" role="status" aria-label="Loading">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="glass rounded-xl2 p-4 space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
