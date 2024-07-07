import { RouterProvider } from "react-router-dom";

import ThemeProvider from "./lib/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthProvider } from "./lib/auth";
import { router } from "./router";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
