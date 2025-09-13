import { SidebarProvider } from "@/components/ui/sidebar";
import StudioNavbar from "../components/studio-navbar";
import StudioSidebar from "../components/studio-sidebar";

interface LayoutInterface {
  children: React.ReactNode;
}

function StudioLayout({ children }: LayoutInterface) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSidebar />
          <main className="flex overflow-y-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default StudioLayout;
