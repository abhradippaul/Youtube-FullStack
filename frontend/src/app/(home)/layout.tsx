import HomeLayout from "@/modules/home/ui/layouts/home-layout";
interface LayoutInterface {
  children: React.ReactNode;
}

function Layout({ children }: LayoutInterface) {
  return (
    <div>
      <HomeLayout>{children}</HomeLayout>{" "}
    </div>
  );
}

export default Layout;
