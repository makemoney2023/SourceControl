import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { Check } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownMenuContent({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-theme="jarvis"
        className={cn("j-dropdown-content", className)}
        sideOffset={6}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuLabel(props: ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return <DropdownMenuPrimitive.Label className="j-dropdown-label" {...props} />;
}

export function DropdownMenuItem(props: ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return <DropdownMenuPrimitive.Item className="j-dropdown-item" {...props} />;
}

export function DropdownMenuCheckboxItem(
  { children, ...props }: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>,
) {
  return (
    <DropdownMenuPrimitive.CheckboxItem className="j-dropdown-item j-dropdown-checkbox" {...props}>
      <DropdownMenuPrimitive.ItemIndicator data-testid="dropdown-check-indicator">
        <Check aria-hidden="true" size={13} />
      </DropdownMenuPrimitive.ItemIndicator>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuSeparator(
  props: ComponentProps<typeof DropdownMenuPrimitive.Separator>,
) {
  return <DropdownMenuPrimitive.Separator className="j-dropdown-separator" {...props} />;
}
