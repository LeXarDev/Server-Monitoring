import { Skeleton } from "../ui/Skeleton";

export function ServerCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-4/5" />
      </div>

      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24 rounded-md" />
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
