import { Skeleton } from "../ui/Skeleton";

export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
}
