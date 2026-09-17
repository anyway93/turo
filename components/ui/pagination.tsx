import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cx } from "@/lib/cx";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav className={cx("pagination", className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cx("pagination__list", className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li {...props} />;
}

function PaginationLink({
  className,
  isActive,
  ...props
}: React.ComponentProps<"a"> & { isActive?: boolean }) {
  return (
    <Button asChild variant={isActive ? "outline" : "ghost"} size="sm">
      <a className={className} {...props} />
    </Button>
  );
}

function PaginationPrevious({
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink {...props}>
      <ChevronLeftIcon />
      <span>{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink {...props}>
      <span>{text}</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis() {
  return (
    <span className="pagination__ellipsis">
      <MoreHorizontalIcon />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
