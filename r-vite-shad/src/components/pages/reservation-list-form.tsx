import type { Prenotazione } from "@/types/types";
import { useEffect, useState, useMemo } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const API_URL = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 8; // Numero di righe per pagina

const Reservation = () => {
  const [reservations, setReservations] = useState<Prenotazione[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadReservation = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/prenotazioni`);
      if (!res.ok) throw new Error("Errore nel recupero delle prenotazioni");
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    }
  };

  useEffect(() => {
    loadReservation();
  }, []);

  // REVIEW: Usiamo useMemo per filtrare. È più efficiente di un useEffect + stato extra
  const filteredReservations = useMemo(() => {
    if (!reservations) return [];
    const s = searchTerm.toLowerCase();
    return reservations.filter((res) => 
      res.id?.toString().includes(s) ||
      res.utenteId?.toString().includes(s) ||
      res.abitazioneId?.toString().includes(s)
    );
  }, [searchTerm, reservations]);

  // Calcolo dati per paginazione
  const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const lastIdx = currentPage * ITEMS_PER_PAGE;
    const firstIdx = lastIdx - ITEMS_PER_PAGE;
    return filteredReservations.slice(firstIdx, lastIdx);
  }, [currentPage, filteredReservations]);

  // Reset pagina se cambia la ricerca
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questa prenotazione?")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/prenotazioni/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
      loadReservation();
    } catch (err) {
      alert("Errore nell'eliminazione"+err);
    }
  };

  if (error) return (
    <Alert variant="destructive" className="m-6">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  if (!reservations) return <LoadingSkeleton />;

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
              <CardDescription>Totale: {filteredReservations.length}</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Utente</TableHead>
                  <TableHead>Abitazione</TableHead>
                  <TableHead>Check-in / Out</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((res) => (
                    <TableRow key={res.id}>
                      <TableCell className="font-mono text-xs">#{res.id}</TableCell>
                      <TableCell>
                        <BadgeLabel color="blue">UID: {res.utenteId}</BadgeLabel>
                      </TableCell>
                      <TableCell>
                        <BadgeLabel color="purple">AID: {res.abitazioneId}</BadgeLabel>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-col">
                          <span>In: {new Date(res.dataInizio).toLocaleDateString()}</span>
                          <span className="text-muted-foreground text-xs">Out: {new Date(res.dataFine).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <PrenotazioneForm 
                            prenotazione={res} 
                            onSuccess={loadReservation}
                            trigger={<Button variant="ghost" size="icon"><Info className="h-4 w-4" /></Button>}
                          />
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(res.id!)} className="text-destructive hover:bg-destructive/10">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Nessun risultato.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* COMPONENTE PAGINATION SHADCN */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i} className="hidden sm:inline-block">
                      <PaginationLink 
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Componenti helper per pulizia codice
const BadgeLabel = ({ children, color }: { children: React.ReactNode, color: 'blue' | 'purple' }) => {
  const styles = color === 'blue' ? "bg-blue-50 text-blue-700 ring-blue-700/10" : "bg-purple-50 text-purple-700 ring-purple-700/10";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles}`}>
      {children}
    </span>
  );
};

const LoadingSkeleton = () => (
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

export default Reservation;