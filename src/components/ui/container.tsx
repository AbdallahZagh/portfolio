import { cn } from "@/lib/utils";

/** Page gutters from Figma: 20px on mobile, 56px at 1440, content max 1328px. */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 xl:px-14", className)} {...props} />;
}
