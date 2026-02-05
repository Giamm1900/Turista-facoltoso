import { Pencil, Star, Trash, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Feedback } from "@/types/types";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import FeedbackForm from "../forms/feedback-form";

const API_URL = import.meta.env.VITE_API_URL;

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/feedbacks`);
      if (!res.ok) throw new Error("Feedback non trovati");
      const data = await res.json();
      setFeedbacks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFeedBack = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questo feedback?")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/feedbacks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore eliminazione");
      setFeedbacks((prev) => (prev ? prev.filter((r) => r.id !== id) : null));
    } catch (error) {
      console.error(error);
    }
  };

  if (feedbacks?.length === 0) {
    return <p className="text-center text-muted-foreground py-4">Nessun feedback presente.</p>;
  }

  if (!feedbacks) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <section className="bg-accent/10 p-4 rounded-xl border border-dashed">
        <h3 className="text-lg font-semibold mb-4 text-center">Lascia un feedback</h3>
        <FeedbackForm onSuccess={loadFeedbacks} />
      </section>

      <div className="space-y-4">
        {feedbacks.map((f) => (
          <Card key={f.id} className="relative overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex text-yellow-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < f.punteggio ? "fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => setEditingId(editingId === f.id ? null : f.id)}
                  >
                    {editingId === f.id ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteFeedBack(f.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {editingId !== f.id && <CardTitle className="text-xl">{f.titolo}</CardTitle>}
            </CardHeader>

            <CardContent>
              {editingId === f.id ? (
                <div className="pt-2 bg-muted/20 p-4 rounded-lg">
                  <p className="text-xs font-bold mb-2 uppercase">Modifica Feedback</p>
                  <FeedbackForm  
                    onSuccess={() => {
                      setEditingId(null);
                      loadFeedbacks();
                    }} 
                  />
                </div>
              ) : (
                <>
                  <CardDescription className="text-foreground/80 italic text-base">
                    "{f.testo}"
                  </CardDescription>
                  
                  <div className="flex gap-4 mt-4 pt-4 border-t border-border/50">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                      User id: {f.idUser}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                      Residences id : {f.idAbitazione}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                      Prenotazione id: {f.prenotazioneId}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;