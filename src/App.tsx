import { RouterProvider } from "react-router-dom";

import ThemeProvider from "./lib/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { router } from "./router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Loader2 } from "lucide-react";
import { Toaster } from "./components/custom/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-45 w-45 animate-spin" />
          </div>
        }
      >
        <ErrorBoundary fallback={<p>Error Occurring</p>}>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
              <ReactQueryDevtools />
            </QueryClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </Suspense>
      <Toaster position="top-right" richColors />
    </>
  );
}
