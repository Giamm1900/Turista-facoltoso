import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert"; // Suggerito

interface TopHostsValue {
  nome: string;
  numero: number;
}
const API_URL = import.meta.env.VITE_API_URL
const TophostsCard = () => {
  const [topHosts, setTopHost] = useState<TopHostsValue[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopHost = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/top-hosts`);
        if (!res.ok) throw new Error("Errore nel recupero dati");
        const data = await res.json();
        setTopHost(data);
        console.log(topHosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore sconosciuto");
      }
    };
    loadTopHost();
  }, []);

  // 1. Stato di Caricamento
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
  
  // 2. Stato Loading (Skeleton)
  if (!topHosts) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-30 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  // 3. Render dei Dati
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {topHosts.map((host, index) => (
        <Card key={index} className="rounded-2xl shadow-sm border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Top Host #{index + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-lg font-semibold truncate">
              {host.nome}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{host.numero}</span>
              <span className="text-xs text-muted-foreground">Prenotazioni</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TophostsCard;
