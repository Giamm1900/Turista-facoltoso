import AllSuperHost from "../dashboard/all-super-host";
import MostPopularAbitazione from "../dashboard/most-popular-abitazione";
import TophostsCard from "../dashboard/Top-hosts-card";
import { Outlet } from "react-router";

const Homepage = () => {
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-background to-muted/40">
      <main className="container mx-auto px-4 py-10 space-y-16">

        {/* HERO */}
        <section className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Turista Facoltoso Back-Office
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Analisi in tempo reale delle performance degli host e delle abitazioni più prenotate.
          </p>
        </section>

        {/* SEZIONE SUPER HOST */}
        <section className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl font-semibold">Super Host</h2>
            <p className="text-muted-foreground">
              Host con oltre 100 prenotazioni totali
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6">
            <AllSuperHost />
          </div>
        </section>

        {/* SEZIONE TOP HOST ULTIMO MESE */}
        <section className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl font-semibold">Top Host del mese</h2>
            <p className="text-muted-foreground">
              Chi ha ricevuto più prenotazioni negli ultimi 30 giorni
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6">
            <TophostsCard />
          </div>
        </section>

        {/* SEZIONE ABITAZIONI PIÙ POPOLARI */}
        <section className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl font-semibold">Abitazioni più prenotate</h2>
            <p className="text-muted-foreground">
              Le strutture più richieste dell’ultimo mese
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6">
            <MostPopularAbitazione />
          </div>
        </section>

        {/* CONTENUTO DINAMICO */}
        <section className="bg-muted/30 rounded-2xl p-6">
          <Outlet />
        </section>

      </main>
    </div>
  );
};

export default Homepage;