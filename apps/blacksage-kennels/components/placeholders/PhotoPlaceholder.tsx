import { cn } from "@/lib/utils";

type PhotoPlaceholderProps = {
  caption: string;
  className?: string;
};

export function PhotoPlaceholder({ caption, className }: PhotoPlaceholderProps) {
  return (
    <figure
      className={cn(
        "relative aspect-[4/3] overflow-hidden rounded-sm border border-blacksage-graphite bg-blacksage-charcoal-light",
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-1 opacity-15">
          <span className="h-8 w-3 bg-blacksage-amber" />
          <span className="h-8 w-3 bg-blacksage-amber-soft" />
          <span className="h-8 w-3 bg-blacksage-amber" />
        </div>
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-blacksage-black/70 px-4 py-3 text-center text-xs text-blacksage-sage-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
