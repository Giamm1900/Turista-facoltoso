import type { Utente } from "@/types/types";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";

const API_URL = import.meta.env.VITE_API_URL;

const Users = () => {
  const [users, setUsers] = useState<Utente[] | null>(null);

  useEffect(() => {
    const loadResidences = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users`);
        if (!res) {
          throw new Error("errore recupero Utenti");
        }
        const data = await res.json();
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadResidences();
  }, []);

    if (!users) {
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
      <Card>
        <CardHeader>
          <CardTitle>Tutte gli Utenti</CardTitle>
          <CardDescription>
            Totale Utenti: {users.length}
          </CardDescription>

          {/* Barra di ricerca
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per ID, utente, data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div> */}
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nessuna prenotazione trovata
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cognome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Indirizzo</TableHead>
                    <TableHead>Data Registrazione</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        #{u.id}
                      </TableCell>
                      <TableCell>{u.nomeUser}</TableCell>
                      <TableCell>{u.cognome || "N/A"}</TableCell>
                      <TableCell>{u.email || "N/A"}</TableCell>
                      <TableCell>{u.indirizzoUser}</TableCell>
                      <TableCell>{u.dataRegistrazione || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default Users