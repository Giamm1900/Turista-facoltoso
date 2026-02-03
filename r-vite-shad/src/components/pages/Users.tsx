import type { Utente } from "@/types/types";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Trash, Loader2, Pencil } from "lucide-react"; // Aggiunto Pencil
import { Alert, AlertDescription } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import UserFormDialog from "../forms/user-form";

const API_URL = import.meta.env.VITE_API_URL;

const Users = () => {
  const [users, setUsers] = useState<Utente[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<Utente | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users`);
      if (!res.ok) throw new Error("Errore nel recupero degli utenti");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    }
  };

  const deleteUser = async (userId: number) => {
    setDeletingUserId(userId);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore nell'eliminazione dell'utente");
      
      setUsers((prev) => prev ? prev.filter((u) => u.id !== userId) : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore eliminazione");
    } finally {
      setDeletingUserId(null);
      setUserToDelete(null);
    }
  };

  if (error) return <Alert variant="destructive" className="m-4"><AlertDescription>{error}</AlertDescription></Alert>;

  if (!users) {
    return (
      <Card className="m-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardHeader>
        <CardContent><div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Gestione Utenti</CardTitle>
            <CardDescription>Totale registrati: {users.length}</CardDescription>
          </div>
          {/* ✅ Bottone per Creazione */}
          <UserFormDialog onSuccess={loadUsers} />
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Nessun utente trovato</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>Nominativo</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Indirizzo</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">#{u.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{u.nomeUser} {u.cognome}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{u.email}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{u.email}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">{u.indirizzoUser}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {/* ✅ Dialog per Modifica */}
                        <UserFormDialog 
                          user={u} 
                          onSuccess={loadUsers} 
                          trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setUserToDelete(u)}
                          disabled={deletingUserId === u.id}
                        >
                          {deletingUserId === u.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confermi l'eliminazione?</AlertDialogTitle>
            <AlertDialogDescription>
              L'utente <strong>{userToDelete?.nomeUser} {userToDelete?.cognome}</strong> verrà rimosso permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={() => userToDelete && deleteUser(userToDelete.id)} className="bg-destructive hover:bg-destructive/90">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;