interface LayoutInterface {
  children: React.ReactNode;
}

function Layout({ children }: LayoutInterface) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}

export default Layout;
