import AllSuperHost from "../dashboard/all-super-host";
import MostPopularAbitazione from "../dashboard/most-popular-abitazione";
import ResidencesByHostId from "../dashboard/residences-by-hostId";
import TophostsCard from "../dashboard/Top-hosts-card";
import { Award, Trophy, Home, Search } from "lucide-react";

const Homepage = () => {
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-background via-background to-muted/30">
      <main className="container mx-auto px-4 py-10 space-y-20">

        {/* HERO */}
        <section className="relative text-center space-y-6 py-16 px-4">
          {/* Background Decorations */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Turista Facoltoso
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Back-Office
              </span>
            </h1>
            
            <p className="text-muted-foreground text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Analisi in tempo reale delle performance degli host e delle abitazioni più prenotate.
            </p>
          </div>
        </section>

        {/* RICERCA PER HOST ID */}
        <section className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold">Ricerca Abitazione</h2>
              <p className="text-muted-foreground mt-1">
                Trova tutte le abitazioni di un host specifico
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-card to-card/50 rounded-2xl shadow-xl border-2 border-primary/10 overflow-hidden">
            <ResidencesByHostId/>
          </div>
        </section>

        {/* SEZIONE SUPER HOST */}
        <section className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Award className="h-6 w-6 text-amber-500" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold">Super Host</h2>
              <p className="text-muted-foreground mt-1">
                Host con oltre 100 prenotazioni totali
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-card to-card/50 rounded-2xl shadow-xl border-2 border-amber-500/10 p-6 lg:p-8">
            <AllSuperHost />
          </div>
        </section>

        {/* SEZIONE TOP HOST ULTIMO MESE */}
        <section className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Trophy className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold">Top Host del Mese</h2>
              <p className="text-muted-foreground mt-1">
                Chi ha ricevuto più prenotazioni negli ultimi 30 giorni
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-card to-card/50 rounded-2xl shadow-xl border-2 border-blue-500/10 p-6 lg:p-8">
            <TophostsCard />
          </div>
        </section>

        {/* SEZIONE ABITAZIONI PIÙ POPOLARI */}
        <section className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-orange-300">
              <Home className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold">Abitazioni Più Prenotate</h2>
              <p className="text-muted-foreground mt-1">
                Le strutture più richieste dell'ultimo mese
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-card to-card/50 rounded-2xl shadow-xl border-2 border-emerald-500/10 p-6 lg:p-8">
            <MostPopularAbitazione />
          </div>
        </section>

      </main>
    </div>
  );
};

export default Homepage;