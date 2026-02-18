type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return <div className="container mx-auto mt-5">{children}</div>;
};

export default Layout;
