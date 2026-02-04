import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, MapPin, Bed, DoorOpen, Euro, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Abitazione } from "@/types/types";

interface MostPopular extends Abitazione {
  num_prenotazioni: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const MostPopularAbitazione = () => {
  const [data, setData] = useState<MostPopular | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/abitazioni/stats/mostPopular`);
        if (!res.ok) throw new Error("Errore nel recupero dati");
        
        const result = await res.json();
        // Gestiamo sia il caso array che oggetto singolo dal backend
        const item = Array.isArray(result) ? result[0] : result;
        
        setData(item);
      } catch (error) {
        console.error("Errore statistiche:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Skeleton className="h-48 w-full rounded-xl" />;

  if (!data) return null;

  return (
    <Card className="w-full border-none shadow-lg bg-linear-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none px-3">
            TOP DESTINATION
          </Badge>
          <div className="flex items-center gap-1 text-orange-600 font-bold">
            <CalendarCheck size={18} />
            <span>{data.num_prenotazioni} prenotazioni</span>
          </div>
        </div>
        <CardTitle className="text-2xl mt-2 flex items-center gap-2">
          <Home className="text-primary h-6 w-6" />
          {data.nomeAbitazione}
        </CardTitle>
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin size={14} className="mr-1" />
          {data.indirizzoAbitazione}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-200 dark:border-slate-800 my-2">
          <div className="flex flex-col items-center">
            <DoorOpen className="text-slate-400 mb-1" size={20} />
            <span className="text-xs text-muted-foreground">Locali</span>
            <span className="font-semibold">{data.nlocali}</span>
          </div>
          <div className="flex flex-col items-center">
            <Bed className="text-slate-400 mb-1" size={20} />
            <span className="text-xs text-muted-foreground">Posti Letto</span>
            <span className="font-semibold">{data.npostiLetto}</span>
          </div>
          <div className="flex flex-col items-center">
            <Euro className="text-slate-400 mb-1" size={20} />
            <span className="text-xs text-muted-foreground">A Notte</span>
            <span className="font-semibold">{data.prezzoPerNotte}€</span>
          </div>
        </div>
        
        <div className="mt-4 text-[11px] text-muted-foreground italic text-center">
          Disponibile dal {new Date(data.disponibilitaInizio).toLocaleDateString()} al {new Date(data.disponibilitaFine).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default MostPopularAbitazione;