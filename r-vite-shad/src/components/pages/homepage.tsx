import React, { useMemo } from "react";
import { 
  Award, Trophy, Home, Search, Users, Clock, 
  CalendarDays, TrendingUp, ChevronRight 
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { usePrenotazione } from "../context/rent-provider";

// Import dei componenti custom
import AllSuperHost from "../dashboard/all-super-host";
import MostPopularAbitazione from "../dashboard/most-popular-abitazione";
import ResidencesByHostId from "../dashboard/residences-by-hostId";
import TophostsCard from "../dashboard/Top-hosts-card";

/**
 * Componente StatCard riutilizzabile per i KPI superiori
 */
const StatCard = ({ title, value, icon: Icon, description, trend }: any) => (
  <Card className="overflow-hidden transition-all hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {trend && <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 hover:bg-green-100">+{trend}%</Badge>}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

const Homepage = () => {
  const { prenotazioni } = usePrenotazione();

  // Formattazione data memoizzata
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950">
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-[1600px]">
        
        {/* Header Sezione */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Dashboard Overview
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm capitalize">{formattedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="px-3 py-1 font-normal">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live System Status
             </Badge>
          </div>
        </div>

        {/* KPI Grid - Statistiche Rapide */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Prenotazioni Totali" 
            value={prenotazioni?.length || "0"} 
            icon={TrendingUp}
            description="Dati complessivi del sistema"
            trend="12"
          />
          <StatCard 
            title="Analisi Ricerca" 
            value="Filtri Attivi" 
            icon={Search}
            description="Ottimizzato per ID Host"
          />
          <StatCard 
            title="Performance Host" 
            value="Top 1%" 
            icon={Award}
            description="Media rating globale"
          />
          <StatCard 
            title="Uptime Dati" 
            value="100%" 
            icon={Clock}
            description="Sincronizzato in tempo reale"
          />
        </div>

        {/* Main Grid: 2/3 Area Operativa, 1/3 Statistiche Laterali */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Colonna Sinistra: Strumenti e Ricerca (Larghezza 2/3) */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="shadow-sm border-none bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-500" />
                    Ricerca Abitazione per Host
                  </CardTitle>
                  <CardDescription>Gestisci e visualizza le proprietà filtrate per identificativo host</CardDescription>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <ResidencesByHostId />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none bg-white dark:bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Home className="h-5 w-5 text-orange-500" />
                      Abitazioni Più Prenotate
                    </CardTitle>
                    <CardDescription>Focus sulle strutture con il più alto tasso di occupazione nell'ultimo mese</CardDescription>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <MostPopularAbitazione />
              </CardContent>
            </Card>
          </div>

          {/* Colonna Destra: Classifiche e Ranking (Larghezza 1/3) */}
          <div className="space-y-6">
            <Card className="shadow-sm border-none bg-white dark:bg-slate-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Super Host
                </CardTitle>
                <CardDescription>Elite dei proprietari con +100 prenotazioni</CardDescription>
              </CardHeader>
              <CardContent>
                <AllSuperHost />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none bg-white dark:bg-slate-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-500" />
                  Performance Mensile
                </CardTitle>
                <CardDescription>Top performer negli ultimi 30 giorni</CardDescription>
              </CardHeader>
              <CardContent>
                <TophostsCard />
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Homepage;