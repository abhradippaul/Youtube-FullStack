"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useQueryClient } from "./get-query-client";

interface LayoutInterface {
  children: React.ReactNode;
}

function QueryClient_Provider({ children }: LayoutInterface) {
  const queryClient = useQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryClient_Provider;
