import { Outlet } from "react-router";
import Navbar from "./navbar";


export const Layout = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <Navbar />
      <main className="flex-1 space-y-4 p-4">
        <Outlet />
      </main>
    </div>
  );
};