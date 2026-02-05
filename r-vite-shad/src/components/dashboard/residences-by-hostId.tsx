import type { Abitazione } from "@/types/types";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
} from "../ui/card";
import { Search, Home, MapPin } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const ResidencesByHostId = () => {
  const [hostId, setHostId] = useState<string>("");
  const [residences, setResidences] = useState<Abitazione[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadResidencesByHostId = async (id: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/v1/abitazioni/hosts/${id}`);
      if (!res.ok) {
        setResidences([]);
        return;
      }
      const data = await res.json();
      setResidences(data);
    } catch (error) {
      console.error("Errore nel caricamento:", error);
      setResidences([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHostId(val);

    if (val === "") {
      setResidences([]);
      return;
    }

    const numericId = parseInt(val, 10);
    if (!isNaN(numericId)) {
      loadResidencesByHostId(numericId);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Search Input Section */}
      <div className="mb-8 space-y-3">
        <Label htmlFor="idHost" className="text-base font-medium">
          ID Host
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="idHost"
            type="number"
            className="pl-10 h-12 text-lg border-2 focus:border-primary transition-colors"
            value={hostId}
            onChange={handleInputChange}
            placeholder="Es: 123"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Home className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">
            Risultati {residences.length > 0 && `(${residences.length})`}
          </h3>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Caricamento...</p>
          </div>
        ) : residences && residences.length > 0 ? (
          <div className="grid gap-4">
            {residences.map((a) => (
              <Card
                key={a.id}
                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Home className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {a.nomeAbitazione || "Nome non disponibile"}
                      </h4>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="text-sm">
                          {a.indirizzoAbitazione || "Indirizzo non presente"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {hostId
                ? "Nessuna abitazione trovata per questo host."
                : "Inserisci un ID host per iniziare la ricerca."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidencesByHostId;
