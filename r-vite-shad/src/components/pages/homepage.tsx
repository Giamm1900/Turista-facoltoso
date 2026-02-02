import TophostsCard from "../dashboard/Top-hosts-card";
import { Outlet } from "react-router";

const Homepage = () => {
  return (
    <div className="w-full">
      <main className="flex flex-col items-center p-4 space-y-4">
        <TophostsCard />
        <Outlet />
      </main>
    </div>
  );
};

export default Homepage;
