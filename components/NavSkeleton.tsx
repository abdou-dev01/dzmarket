import { Skeleton } from "./ui/skeleton";

const NavSkeleton = () => {
  const array = new Array(5);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Skeleton className="w-48 h-9" />
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {array.map((arr) => (
            <Skeleton className="text-sm font-medium transition-colors hover:text-primary" />
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Skeleton className="w-10 h-10" />
          <Skeleton className="w-14 h-6" />
        </div>
      </div>
    </div>
  );
};

export default NavSkeleton;
