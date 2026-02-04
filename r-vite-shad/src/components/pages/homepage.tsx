import MostPopularAbitazione from "../dashboard/most-popular-abitazione";
import TophostsCard from "../dashboard/Top-hosts-card";
import { Outlet } from "react-router";

const Homepage = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <main className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <h2 className="font-semibold text-4xl text-center">Host con più prenotazioni dell'ultimo mese</h2>
          <TophostsCard />
        </div>
        <hr className="border-muted" />
        <div className=" grid grid-cols-1 md:grid-cols-1 gap-6">
          <h2 className="font-semibold text-4xl text-center">Abitazioni più prenotate dell'ultimo mese</h2>
          <MostPopularAbitazione />
        </div>
        <hr className="border-muted" />
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Homepage;
