import { Pencil, Star, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { Feedback } from "@/types/types";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import FeedbackForm from "../forms/feedback-form";

const API_URL = import.meta.env.VITE_API_URL;

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);

  if (feedbacks?.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        Nessun feedback per questa abitazione.
      </p>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    const res = await fetch(`${API_URL}/api/v1/feedbacks`);
    if (!res.ok) {
      throw new Error("errore feedbacks non tovati");
    }
    const data = await res.json();
    console.log(data);
    
    setFeedbacks(data);
  };

  const deleteFeedBack = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questa abitazione?")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/feedbacks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Error delete feedback con id: " + id);
      }
      setFeedbacks((prev) => (prev ? prev.filter((r) => r.id !== id) : null));
    } catch (error) {
      console.error(error);
      alert("Impossibile eliminare feedback.");
    }
  };

  if (!feedbacks) {
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
      <div className="space-y-4 max-h-100 pr-2">
          <FeedbackForm onSuccess={loadFeedbacks}/>
      </div>
      <div className="space-y-4 max-h-100 pr-2">
        {feedbacks?.map((f) => (
          <Card key={f.id} className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < f.punteggio ? "fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
              <CardHeader className="text-lg font-bold">{f.titolo}</CardHeader>
              <CardDescription>
                <p className="text-mm italic">"{f.testo}"</p>
              </CardDescription>
              <p className="text-[10px] mt-2 text-muted-foreground uppercase tracking-wider">
                Utente ID: {f.idUser}
              </p>
              <p className="text-[10px] mt-2 text-muted-foreground uppercase tracking-wider">
                Abitazione ID: {f.idAbitazione}
              </p>
            </CardContent>
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteFeedBack(f.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className=" hover:text-accent-foreground hover:bg-accent-foreground/35"
                onClick={() => deleteFeedBack(f.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default FeedbackList;
