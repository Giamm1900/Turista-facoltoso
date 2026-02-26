import AllSuperHost from "../dashboard/all-super-host";
import MostPopularAbitazione from "../dashboard/most-popular-abitazione";
import ResidencesByHostId from "../dashboard/residences-by-hostId";
import TophostsCard from "../dashboard/Top-hosts-card";
import { Award, Trophy, Home, Search, Users, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Homepage = () => {
  const now = new Date();
  const formatted = now.toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-screen-2xl">
        <span className="text-s"><Clock/>{formatted}</span>
        <Separator />

        {/* Grid principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Ricerca Abitazione per Host ID */}
          <Card className="lg:col-span-1 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Ricerca Abitazione per Host ID</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Abitazioni associate a un host specifico
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <ResidencesByHostId />
            </CardContent>
          </Card>

          {/* Super Host */}
          <Card className="lg:col-span-1 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-amber-500/10">
                  <Award className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Super Host</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Host con oltre 100 prenotazioni totali
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <AllSuperHost />
            </CardContent>
          </Card>

          {/* Top Host del Mese */}
          <Card className="lg:col-span-1 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-green-500/10">
                  <Trophy className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Top Host del Mese</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Più prenotazioni negli ultimi 30 giorni
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <TophostsCard />
            </CardContent>
          </Card>

        </div>

        {/* Riga inferiore — Abitazioni più prenotate (full width) */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-orange-500/10">
                <Home className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Abitazioni Più Prenotate</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Le strutture più richieste nell&apos;ultimo mese
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <MostPopularAbitazione />
          </CardContent>
        </Card>

      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-3 flex items-center gap-2 text-xs text-muted-foreground bg-background">
        <Users className="h-3.5 w-3.5" />
        <span>Back Office — Tutti i dati sono aggiornati in tempo reale</span>
      </footer>
    </div>
  );
};

export default Homepage;