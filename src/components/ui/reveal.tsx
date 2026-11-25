import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function RevealItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "header" | "li";
}) {
  return <Tag className={cn(className)}>{children}</Tag>;
}
