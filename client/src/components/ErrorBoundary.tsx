import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, WifiOff } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function connectionMessage(error: Error | null) {
  const text = error?.message.toLowerCase() ?? "";
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "You appear to be offline. Reconnect to the internet and try again.";
  }
  if (
    text.includes("disconnect") ||
    text.includes("network") ||
    text.includes("fetch")
  ) {
    return "EZROME lost its connection to the server. Check your connection and try again.";
  }
  return "EZROME could not load this screen. Please try again.";
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const offline = typeof navigator !== "undefined" && !navigator.onLine;
      return (
        <div
          className="flex min-h-screen items-center justify-center bg-background p-8"
          role="alert"
        >
          <div className="flex w-full max-w-lg flex-col items-center p-8 text-center">
            {offline ? (
              <WifiOff
                size={48}
                className="mb-6 text-destructive"
                aria-hidden="true"
              />
            ) : (
              <AlertTriangle
                size={48}
                className="mb-6 text-destructive"
                aria-hidden="true"
              />
            )}
            <h2 className="mb-4 text-xl">Connection interrupted</h2>
            <p className="mb-6 text-muted-foreground">
              {connectionMessage(this.state.error)}
            </p>
            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2",
                "bg-primary text-primary-foreground hover:opacity-90"
              )}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
