import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-fg"
      />
      <Input
        type="search"
        className={cn("h-11 rounded-md bg-surface pl-9", className)}
        {...props}
      />
    </div>
  );
}
