import type { SuperHost } from "@/types/types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ShieldCheck } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const AllSuperHost = () => {
  const [superHosts, setSuperHost] = useState<SuperHost[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuperUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/superHosts`);
        if (!res.ok) throw new Error("Errore nel recupero dei super host");
        const data = await res.json();
        setSuperHost(data);
      } catch (error) {
        console.error("Errore nella fetch", error);
        setSuperHost([]);
      } finally {
        setLoading(false);
      }
    };
    loadSuperUser();
  }, []);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) return <LoadingSkeleton />;

  if (!superHosts || superHosts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Nessun SuperHost disponibile al momento.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold tracking-tight">I nostri SuperHost</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {superHosts.map((host) => (
          <Card key={host.hostId} className="transition-all hover:shadow-md border-muted">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              {/* <Avatar className="h-12 w-12 border-2 border-primary/20">
                Supponendo che il tipo SuperHost abbia avatarUrl e nome
                <AvatarImage src={host.} alt={host.nome} /> 
                <AvatarFallback className="bg-primary/10 text-primary">
                  {host.nome?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar> */}
              <div className="flex flex-col">
                {/* <span className="font-semibold leading-none">{host.nome}</span> */}
                <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                  Host Professionista
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none flex gap-1 items-center">
                  <Star className="h-3 w-3 fill-current" />
                  SuperHost
                </Badge>
                {/* Esempio di dato aggiuntivo se presente nel DTO */}
                <span className="text-xs text-muted-foreground">
                  {host.totalePrenotazioni || 2} anni di attività
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllSuperHost;