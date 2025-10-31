import { ReactNode, ElementType } from "react";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
  as?: ElementType;
}

const sizeMap: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-screen-2xl",
  full: "max-w-full",
};

export function Container({ children, size = "lg", className = "", as = "div" }: ContainerProps) {
  const Component = as;
  const baseStyles = "mx-auto px-4 sm:px-6 lg:px-8";
  const combinedClassName = [baseStyles, sizeMap[size], className].filter(Boolean).join(" ");

  return <Component className={combinedClassName}>{children}</Component>;
}
