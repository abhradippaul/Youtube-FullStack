"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface LayoutInterface {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

function QueryClient_Provider({ children }: LayoutInterface) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryClient_Provider;
