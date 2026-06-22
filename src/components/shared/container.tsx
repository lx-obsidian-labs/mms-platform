import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide";
}

export function Container({
  className,
  size = "default",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--container-padding)]",
        {
          "max-w-[var(--container-max)]": size === "default",
          "max-w-[900px]": size === "narrow",
          "max-w-[1400px]": size === "wide",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
