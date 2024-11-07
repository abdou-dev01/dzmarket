"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/useStoreModal";
import { Store } from "@prisma/client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Store[];
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({
  stores = [],
  className,
}) => {
  const [open, setOpen] = useState(false);
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const currentStore = useMemo(() => {
    return stores.find((store) => store.id === params.storeId);
  }, [stores]);

  const onStoreSelect = useCallback(
    (store: Store) => {
      setOpen(false);
      router.push(`${store.id}`);
    },
    [router]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="select a store"
          className={cn(`w-[200px] justify-between`, className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.name}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store" />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {stores.map((store) => (
                <CommandItem
                  key={store.id}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.name}
                  {currentStore?.id === store.id && (
                    <Check className={cn(`ml-auto h-4 w-4`)} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                className="cursor-pointer"
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
