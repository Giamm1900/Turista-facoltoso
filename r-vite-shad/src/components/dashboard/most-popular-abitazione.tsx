import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const API_URL = import.meta.env.VITE_API_URL;

const chartConfig = {
  num_prenotazioni: {
    label: "Prenotazioni",
    color: "hsl(var(--primary))",
  },
};

const MostPopularAbitazione = () => {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/abitazioni/stats/mostPopular`);
        if (!res.ok) throw new Error("Errore API");
        
        const result = await res.json();
        
        // Trasformiamo in array se arriva un oggetto singolo
        const dataArray = Array.isArray(result) ? result : [result];

        // Normalizziamo i campi per garantire che il grafico trovi
        // `nomeAbitazione` e `num_prenotazioni` (campo COUNT derivato)
        const nameKeys = [
          "nomeAbitazione",
          "nome",
          "name",
          "titolo",
          "title",
          "abitazione",
          "nome_residenza",
        ];
        const countKeys = [
          "num_prenotazioni",
          "prenotazioni",
          "count",
          "numero",
          "totalePrenotazioni",
          "totale_prenotazioni",
          "numeroPrenotazioni",
          "totale",
          "numero_prenotazioni",
        ];

        const getFirst = (obj: any, keys: string[]) => {
          for (const k of keys) {
            if (k in obj && obj[k] != null) return obj[k];
          }
          return undefined;
        };

        const normalized = dataArray.map((item: any) => {
          let rawName = getFirst(item, nameKeys);
          if (rawName == null) {
            // prova a cercare qualsiasi campo stringa come fallback
            for (const [k, v] of Object.entries(item)) {
              if (typeof v === "string" && k.toLowerCase().includes("nome")) {
                rawName = v;
                break;
              }
            }
          }

          let rawCount = getFirst(item, countKeys);
          if (rawCount == null) {
            // prova a trovare il primo campo numerico
            for (const [k, v] of Object.entries(item)) {
              if (typeof v === "number") {
                rawCount = v;
                break;
              }
              if (typeof v === "string" && /^\d+$/.test(v)) {
                rawCount = parseInt(v, 10);
                break;
              }
            }
          }

          return {
            ...item,
            nomeAbitazione: rawName != null ? String(rawName) : "Sconosciuto",
            num_prenotazioni: Number(rawCount) || 0,
          };
        });

        console.log("MostPopular normalized:", normalized);
        setData(normalized);
        
      } catch (error) {
        console.error("Errore:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
        <CardContent><Skeleton className="h-62.5 w-full" /></CardContent>
      </Card>
    );
  }

  if (data?.length === 0) {
    return <div className="p-4 text-center">Nessun dato disponibile per l'ultimo periodo.</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top del Mese</CardTitle>
        <CardDescription>L'abitazione più richiesta nell'ultimo periodo</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="num_prenotazioni" 
              fill="var(--color-num_prenotazioni)"
              radius={[4, 4, 0, 0]}
              barSize={60}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MostPopularAbitazione;