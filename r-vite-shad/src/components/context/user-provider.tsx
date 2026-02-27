import type { Utente } from "@/types/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface UserContextType {
  users: Utente[] | null;
  getAll: () => Utente[] | undefined;
  getById: (id: Utente["id"]) => Utente | undefined;
  getByName: (name: Utente["nomeUser"]) => Utente | undefined;
  addUser: (utente: Utente) => Promise<void>;
  removeById: (id: Utente["id"]) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUtente = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error(
      "Error: useUtente può essere utilizzato solo all'interno di UserProvider",
    );
  }
  return ctx;
};

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<Utente[] | null>([]);

  const getAll = () => {
    if (users?.length === 0) {
      return [];
    }
    return users || undefined;
  };

  const getById = (id: Utente["id"]) => {
    if (id === 0 || id === null) {
      throw new Error("Error: id non può essere 0 o null" + id);
    }
    return users?.find((u) => u.id === id);
  };

  const getByName = (name: Utente["nomeUser"]) => {
    return users?.find((u) => u.nomeUser === name);
  };

  const addUser = async (user: Utente) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        throw new Error("Errore durante il salvataggio");
      }
      const newU = await res.json();
      setUsers((prev) => [...(prev ?? []), newU]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const removeById = async (id: Utente["id"]) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
      setUsers((prev) => prev?.filter((p) => p.id !== id) ?? []);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users`);
        if (!res.ok) {
          throw new Error("Errore nel recupero degli Utenti");
        }
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    loadUsers();
  }, []);

  return (<UserContext value = {{users,getAll,getById,getByName,addUser,removeById}}>{children}</UserContext>);
};

export default UserProvider;
