import type { Prenotazione } from "@/types/types";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Trash, Info } from "lucide-react";
import LastReservation from "../dashboard/last-reservation";
import { Button } from "../ui/button";
import PrenotazioneForm from "../forms/reservation-form";

const API_URL = import.meta.env.VITE_API_URL;

const Reservation = () => {
  const [reservations, setReservations] = useState<Prenotazione[] | null>(null);
  const [filteredReservations, setFilteredReservations] = useState<Prenotazione[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadReservation = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/prenotazioni`);
      if (!res.ok) throw new Error("Errore nel recupero delle prenotazioni");
      const data = await res.json();
      setReservations(data);
      setFilteredReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    }
  };

  useEffect(() => {
    loadReservation();
  }, []);

  // Filtro ricerca
  useEffect(() => {
    if (!reservations) return;
    const filtered = reservations.filter((res) => {
      const s = searchTerm.toLowerCase();
      return (
        res.id?.toString().includes(s) ||
        res.utenteId?.toString().includes(s) ||
        res.abitazioneId?.toString().includes(s)
      );
    });
    setFilteredReservations(filtered);
  }, [searchTerm, reservations]);

  const handleDelete = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questa prenotazione?")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/prenotazioni/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
      loadReservation();
    } catch (err) {
      console.error(err)
      alert("Errore nell'eliminazione");
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!reservations) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-50 w-full" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
          <CardContent className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      <LastReservation />

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Gestione Prenotazioni</h2>
        <PrenotazioneForm onSuccess={loadReservation} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Tutte le Prenotazioni</CardTitle>
              <CardDescription>Totale caricate: {reservations.length}</CardDescription>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca ID, Utente o Casa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              Nessuna prenotazione trovata.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead>Abitazione</TableHead>
                    <TableHead>Check-in / Out</TableHead>
                    <TableHead>Data Creazione</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((res) => (
                    <TableRow key={res.id}>
                      <TableCell className="font-mono text-xs">#{res.id}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          UID: {res.utenteId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                          AID: {res.abitazioneId}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-col">
                          <span>In: {new Date(res.dataInizio).toLocaleDateString('it-IT')}</span>
                          <span className="text-muted-foreground">Out: {new Date(res.dataFine).toLocaleDateString('it-IT')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {res.createdAt ? new Date(res.createdAt).toLocaleString('it-IT') : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <PrenotazioneForm 
                            prenotazione={res} 
                            onSuccess={loadReservation}
                            trigger={
                              <Button variant="ghost" size="icon">
                                <Info className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(res.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {searchTerm && (
            <p className="text-xs text-muted-foreground mt-4 italic">
              Risultati della ricerca: {filteredReservations.length}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reservation;