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
import { Search, Trash } from "lucide-react";
import LastReservation from "../dashboard/last-reservation";
import { Button } from "../ui/button";

const API_URL = import.meta.env.VITE_API_URL;

const Reservation = () => {
  const [reservations, setReservations] = useState<Prenotazione[] | null>(null);
  const [filteredReservations, setFilteredReservations] = useState<
    Prenotazione[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReservation = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/prenotazioni`);
        if (!res.ok) {
          throw new Error("Errore nel recupero delle prenotazioni");
        }
        const data = await res.json();
        setReservations(data);
        setFilteredReservations(data);
        console.log("Prenotazioni caricate:", data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore sconosciuto");
        console.error(err);
      }
    };
    loadReservation();
  }, []);

  // Filtro ricerca
  useEffect(() => {
    if (!reservations) return;

    const filtered = reservations.filter((reservation) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        reservation.id?.toString().includes(searchLower) ||
        reservation.utenteId?.toString().includes(searchLower) ||
        reservation.dataInizio?.toLowerCase().includes(searchLower) ||
        reservation.dataFine?.toLowerCase().includes(searchLower) ||
        reservation.abitazioneId?.toString().includes(searchLower)
      );
    });
    setFilteredReservations(filtered);
  }, [searchTerm, reservations]);
  console.log(filteredReservations)
  // Stato di errore
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Stato di caricamento
  if (!reservations) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <LastReservation />
      <Card>
        <CardHeader>
          <CardTitle>Tutte le Prenotazioni</CardTitle>
          <CardDescription>
            Totale prenotazioni: {reservations.length}
          </CardDescription>

          {/* Barra di ricerca */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per ID, utente, data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          {filteredReservations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nessuna prenotazione trovata
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>ID Utente</TableHead>
                    <TableHead>Data inizio</TableHead>
                    <TableHead>Data Fine</TableHead>
                    <TableHead>Data Creazione</TableHead>
                    <TableHead>Abitazione ID</TableHead>
                    <TableHead>Elimina</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        #{reservation.id}
                      </TableCell>
                      <TableCell>{reservation.utenteId}</TableCell>
                      <TableCell>{reservation.dataInizio || "N/A"}</TableCell>
                      <TableCell>{reservation.dataFine}</TableCell>
                      <TableCell>
                        {reservation.createdAt 
                          ? new Date(reservation.createdAt).toLocaleString('it-IT')
                          : "N/A"}
                      </TableCell>
                      <TableCell>{reservation.abitazioneId || "N/A"}</TableCell>
                      <Button variant="destructive">
                        <TableCell>
                          <Trash />
                        </TableCell>
                      </Button>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Info risultati */}
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-4">
              Mostrati {filteredReservations.length} di {reservations.length}{" "}
              risultati
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Reservation;
