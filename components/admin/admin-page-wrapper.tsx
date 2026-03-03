"use client";

import { useEffect, useState, type ReactNode } from "react";
import { BlurFade } from "@/components/ui/blur-fade";

interface AdminPageWrapperProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Shared page shell component for all admin pages.
 * Provides consistent layout, typography, and subtle entrance animations.
 */
export function AdminPageWrapper({
  title,
  description,
  actions,
  children,
}: AdminPageWrapperProps) {
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent) => {
      setShouldAnimate(!event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {shouldAnimate ? (
        <BlurFade delay={0} duration={0.4} offset={6} blur="6px">
          {children}
        </BlurFade>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
