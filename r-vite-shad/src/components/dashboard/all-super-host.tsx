import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

const AllSuperHost = () => {
  const [superHosts, setSuperHost] = useState<{ name: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuperUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/superHosts`);
        if (!res.ok) {
          throw new Error("errore recupero superhost");
          
        }
        const data = await res.json();
        const transformedData = Object.entries(data).map(([key, value]) => ({
          name: key,
          total: value as number,
        }));

        setSuperHost(transformedData);
      } catch (error) {
        console.error("Errore:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSuperUser();
  }, []);

  if (loading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {superHosts.map((host) => (
        <Card key={host.name} className="border-t-4 border-t-yellow-500">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-yellow-100 text-yellow-700">
                {host.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{host.name}</p>
              <Badge variant="outline" className="text-[10px]">PREMIUM HOST</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>Elite Level</span>
            </div>
            <span className="text-lg font-black">{host.total} <span className="text-xs font-normal text-muted-foreground">trip</span></span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default AllSuperHost;