import type { Prenotazione } from "@/types/types";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const LastReservation = () => {
  const [userId, setUserId] = useState<string>("");
  const [latestReservation, setLatestReservation] = useState<Prenotazione | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!userId || isNaN(Number(userId))) {
      setError("Inserisci un ID utente valido");
      return;
    }

    setLoading(true);
    setError(null);
    setLatestReservation(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/prenotazioni/latest/utente/${userId}`);
      
      if (res.status === 404) {
        setError("Nessuna prenotazione trovata per questo utente");
        return;
      }
      
      if (!res.ok) throw new Error("Errore nel recupero dati");
      
      const data = await res.json();
      console.log("Prenotazione trovata:", data);
      setLatestReservation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
        
      {/* Barra di ricerca */}
      <Card>
        <CardHeader>
          <CardTitle>Cerca Ultima Prenotazione</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Inserisci ID utente..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button onClick={handleSearch} disabled={loading || !userId}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Cerca</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Errore */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Risultato */}
      {latestReservation && (
        <Card>
          <CardHeader>
            <CardTitle>Ultima Prenotazione - Utente #{userId}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">ID Prenotazione:</span> {latestReservation.id}
            </div>
            <div>
              <span className="font-semibold">Data:</span> {latestReservation.createdAt}
            </div>
            {/* Aggiungi altri campi della prenotazione */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LastReservation;
