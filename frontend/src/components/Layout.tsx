import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";



interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#F5FDF9]" style={{fontFamily: 'SF Pro Display'}}>{children}



      </main>
      <Footer/>
    </div>
  );
}

export default Layout;