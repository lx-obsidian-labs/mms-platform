import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <section className={cn("relative overflow-hidden bg-surface py-20 pt-28 md:py-28 md:pt-36 lg:py-32 lg:pt-40", className)}>
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Gold glow */}
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true" />

      <Container className="relative text-center">
        <h1 className="font-display text-5xl tracking-wide text-off-white sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gold" aria-hidden="true" />
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
