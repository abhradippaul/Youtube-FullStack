import { SidebarProvider } from "@/components/ui/sidebar";
import HomeNavbar from "../components/home-navbar";
import HomeSidebar from "../components/home-sidebar";

interface LayoutInterface {
  children: React.ReactNode;
}

function HomeLayout({ children }: LayoutInterface) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <HomeSidebar />
          <main className="flex overflow-y-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default HomeLayout;
