export type LoadingSize = "sm" | "md" | "lg";
export type LoadingVariant = "spinner" | "dots" | "pulse";

export interface LoadingProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const dotSizeMap = {
  sm: "h-1.5 w-1.5",
  md: "h-2.5 w-2.5",
  lg: "h-4 w-4",
};

function Spinner({ size }: { size: LoadingSize }) {
  return (
    <svg
      className={`animate-spin ${sizeMap[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function Dots({ size }: { size: LoadingSize }) {
  return (
    <div className="flex items-center gap-1">
      <div
        className={`animate-bounce rounded-full bg-blue-600 ${dotSizeMap[size]}`}
        style={{ animationDelay: "0ms" }}
        aria-hidden="true"
      />
      <div
        className={`animate-bounce rounded-full bg-blue-600 ${dotSizeMap[size]}`}
        style={{ animationDelay: "150ms" }}
        aria-hidden="true"
      />
      <div
        className={`animate-bounce rounded-full bg-blue-600 ${dotSizeMap[size]}`}
        style={{ animationDelay: "300ms" }}
        aria-hidden="true"
      />
    </div>
  );
}

function Pulse({ size }: { size: LoadingSize }) {
  return (
    <div className={`animate-pulse rounded-full bg-blue-600 ${sizeMap[size]}`} aria-hidden="true" />
  );
}

export function Loading({
  size = "md",
  variant = "spinner",
  text,
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      {variant === "spinner" && <Spinner size={size} />}
      {variant === "dots" && <Dots size={size} />}
      {variant === "pulse" && <Pulse size={size} />}
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-label={text || "Loading"}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4" role="status" aria-live="polite">
      {content}
    </div>
  );
}
