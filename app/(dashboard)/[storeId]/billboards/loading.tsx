import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-44 h-9" />
          <Skeleton className="w-24 h-10" />
        </div>
        <hr />
        <Skeleton className="max-w-sm h-10" />
        <table className="w-full h-full">
          <thead>
            <Skeleton className="w-full h-12" />
          </thead>
          <tbody>
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loading;
