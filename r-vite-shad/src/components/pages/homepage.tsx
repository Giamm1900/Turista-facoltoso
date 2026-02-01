import { Outlet } from "react-router";
import Navbar from "../layout/navbar";
import TophostsCard from "../dashboard/Top-hosts-card";

const Homepage = () => {
  return (
    <div className="w-full">
      <Navbar />
      <main className="p-4 flex flex-col items-center">
        <TophostsCard/>
        <Outlet />
      </main>
    </div>
  );
};

export default Homepage;
