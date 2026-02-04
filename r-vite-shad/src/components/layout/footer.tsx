import { Home } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sezione Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">StayHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Trova la tua abitazione ideale per soggiorni indimenticabili. Qualità e comfort garantiti.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Esplora
            </h3>
            <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <Link className="hover:text-primary transition-colors" to={"/abitazioni"}>Abitazioni</Link>
              <Link className="hover:text-primary transition-colors" to={"/prenotazioni"}>Prenotazioni</Link>
              <Link className="hover:text-primary transition-colors" to={"/hosts"}>Diventa Host</Link>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Giammarco De Lauretis</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:underline">Privacy Policy</Link>
            <Link to="#" className="hover:underline">Termini di Servizio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;