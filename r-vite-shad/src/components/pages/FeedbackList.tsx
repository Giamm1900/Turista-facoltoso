import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Feedback } from "@/types/types";

interface FeedbackListProps {
  feedbacks: Feedback[];
}

const FeedbackList = ({ feedbacks }: FeedbackListProps) => {
  if (feedbacks.length === 0) {
    return <p className="text-center text-muted-foreground py-4">Nessun feedback per questa abitazione.</p>;
  }

  return (
    <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
      {feedbacks.map((f) => (
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
              <span className="text-xs text-muted-foreground">
                {new Date(f.dataPublicazione).toLocaleDateString('it-IT')}
              </span>
            </div>
            <p className="text-sm italic">"{f.testo}"</p>
            <p className="text-[10px] mt-2 text-muted-foreground uppercase tracking-wider">
              Utente ID: {f.idHost}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};