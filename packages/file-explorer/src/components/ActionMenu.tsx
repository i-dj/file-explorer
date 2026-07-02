"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

const ACTION_MENU_OPEN_EVENT = "fe:action-menu-open";

export interface ActionMenuConfig {
  label?: React.ReactNode;
  action?: string;
  icon?: any;
  className?: string;
  disabled?: boolean;
  separator?: boolean;
  isHeader?: boolean;
  checked?: boolean;
  isDelete?: boolean;
  render?: (helpers: { closeMenu: () => void }) => React.ReactNode;
  onSelect?: () => void | Promise<void>;
}

interface ActionMenuProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  onAction: (action: string) => void;
  items: ActionMenuConfig[];
  title?: string;
  align?: "start" | "center" | "end";
  mode?: "left-click" | "right-click";
}

export const ActionMenu = ({
  children,
  trigger,
  onAction,
  items,
  title,
  align = "start",
}: ActionMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId();
  const triggerRef = React.useRef<HTMLSpanElement | null>(null);
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null);
  const triggerNode = trigger ?? children;

  React.useEffect(() => {
    if (!triggerRef.current) return;
    setPortalContainer(
      triggerRef.current.closest(".fe-theme") as HTMLElement | null,
    );
  }, []);

  React.useEffect(() => {
    const handleOtherMenuOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail;
      if (detail?.id !== menuId) {
        setOpen(false);
      }
    };

    window.addEventListener(ACTION_MENU_OPEN_EVENT, handleOtherMenuOpen);
    return () => {
      window.removeEventListener(ACTION_MENU_OPEN_EVENT, handleOtherMenuOpen);
    };
  }, [menuId]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      window.dispatchEvent(
        new CustomEvent(ACTION_MENU_OPEN_EVENT, { detail: { id: menuId } }),
      );
    }
    setOpen(nextOpen);
  };

  const hasRenderableContent = (item: ActionMenuConfig) =>
    Boolean(
      item.render || item.isHeader || item.label || item.icon || item.action,
    );

  return (
    <DropdownMenu.Root open={open} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger asChild>
        <span
          ref={triggerRef}
          className="inline-flex cursor-pointer pointer-events-auto"
        >
          {triggerNode}
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal container={portalContainer ?? undefined}>
        <DropdownMenu.Content
          align={align}
          sideOffset={8}
          collisionPadding={16}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "z-9999 min-w-55 overflow-hidden rounded-xl border border-[#2b2d33] bg-[#17191e] p-1.5 text-[#a8aaaf]",
            "shadow-[0_18px_42px_rgba(0,0,0,0.34)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
          )}
        >
          {title && (
            <div className="mb-1 border-b border-[#2d3036] px-3 py-1.5 select-none">
              <span className="text-[length:var(--_fe-font-2xs)] leading-none font-semibold tracking-[0.14em] text-[#c8c9cc] uppercase">
                {title}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-px">
            {items.map((item, index) => {
              const showSeparator =
                item.separator &&
                items
                  .slice(index + 1)
                  .some((nextItem) => hasRenderableContent(nextItem));

              return (
                <React.Fragment key={`${item.action}-${index}`}>
                  {item.separator &&
                  !item.render &&
                  !item.isHeader &&
                  !item.label &&
                  !item.icon &&
                  !item.action ? null : item.render ? (
                    <div
                      className={cn("px-0.5", item.className)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.render({ closeMenu: () => setOpen(false) })}
                    </div>
                  ) : item.isHeader ? (
                    <div className="mt-1 px-3 py-1 select-none">
                      <span className="text-[9px] font-semibold tracking-[0.12em] text-[#c8c9cc] uppercase">
                        {item.label}
                      </span>
                    </div>
                  ) : (
                    <DropdownMenu.Item
                      disabled={item.disabled}
                      onSelect={(e) => {
                        e.preventDefault();
                        if (item.onSelect) {
                          void item.onSelect();
                          setOpen(false);
                          return;
                        }

                        if (item.action) {
                          onAction(item.action);
                          setOpen(false);
                        }
                      }}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-1.5 text-[length:var(--_fe-font-sm)] outline-none",
                        item.isDelete
                          ? "text-[#ff3347] focus:bg-[#3b2028] hover:bg-red-950/80 focus:text-[#ff3347] data-highlighted:bg-[#3b2028] data-highlighted:text-[#ff3347]"
                          : "text-[#a8aaaf] hover:bg-[#3b3d43] hover:text-white focus:bg-[#3b3d43] focus:text-white data-highlighted:bg-[#3b3d43] data-highlighted:text-white",
                        item.checked && "bg-[#3b3d43] text-white",
                        "data-disabled:pointer-events-none data-disabled:opacity-40",
                        item.className,
                      )}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-current">
                        {item.checked ? (
                          <Check
                            size={15}
                            strokeWidth={3}
                            className="text-current"
                          />
                        ) : item.icon ? (
                          React.isValidElement(item.icon) ? (
                            item.icon
                          ) : (
                            (() => {
                              const Icon = item.icon;
                              return <Icon size={15} />;
                            })()
                          )
                        ) : null}
                      </span>
                      <span className="flex-1 text-left">{item.label}</span>
                    </DropdownMenu.Item>
                  )}
                  {showSeparator && (
                    <div className="mx-3 my-1 h-px bg-[#2d3036]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
