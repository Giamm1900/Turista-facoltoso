import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { Abitazione } from "@/types/types";

const API_URL = import.meta.env.VITE_API_URL;

// Definiamo la configurazione del grafico per Shadcn
const chartConfig = {
  prenotazioni: {
    label: "Prenotazioni",
    color: "hsl(var(--primary))",
  },
};

const MostPopularAbitazione = () => {
  
  const [residences, setResidences] = useState<Abitazione[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMostPopularAbitazione = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/abitazioni/stats/mostPopular`);
        if (!res.ok) throw new Error("Errore abitazione non trovata");
        
        const data = await res.json();
        setResidences(Array.isArray(data) ? data : [data]); // Ci assicuriamo sia un array
      } catch (error) {
        console.error("Errore", error);
        setResidences([]); // Array vuoto in caso di errore
      } finally {
        setLoading(false);
      }
    };
    loadMostPopularAbitazione();
  }, []);

  // SKELETON: Mostrato durante il caricamento
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Fallback se non ci sono dati
  if (!residences || residences.length === 0) {
    return <div className="p-4 text-muted-foreground">Nessuna abitazione popolare trovata.</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top Abitazioni</CardTitle>
        <CardDescription>Le strutture più prenotate di sempre</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Usiamo il ChartContainer di Shadcn per gestire i colori e i tooltip */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={residences}>
              <XAxis 
                dataKey="nomeAbitazione" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`}
              />
              {/* Tooltip personalizzato di Shadcn */}
              <Tooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="numeroPrenotazioni" // Assicurati che il backend restituisca questo campo
                fill="var(--color-prenotazioni)" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MostPopularAbitazione;
