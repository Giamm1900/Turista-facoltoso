import { Outlet } from "react-router";
import Navbar from "./navbar";
import Footer from "./footer";

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};