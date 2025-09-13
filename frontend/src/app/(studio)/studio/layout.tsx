import StudioLayout from "@/modules/studio/ui/layouts/studio-layout";
interface LayoutInterface {
  children: React.ReactNode;
}

function Layout({ children }: LayoutInterface) {
  return (
    <div>
      <StudioLayout>{children}</StudioLayout>{" "}
    </div>
  );
}

export default Layout;
