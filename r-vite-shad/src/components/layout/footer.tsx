import { Home, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-muted from-background to-muted/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Turista Facoltoso</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Trova la tua abitazione ideale per soggiorni indimenticabili.
              Qualità e comfort garantiti in ogni destinazione.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                <span>giammarco@stayhub.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span>+39 123 456 7890</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MapPin className="h-4 w-4" />
                <span>Pescara, IT</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Esplora
            </h3>
            <ul className="flex flex-col space-y-3 text-sm">
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  to={"/abitazioni"}
                >
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Abitazioni
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  to={"/prenotazioni"}
                >
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Prenotazioni
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  to={"/hosts"}
                >
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Diventa Host
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Supporto
            </h3>
            <ul className="flex flex-col space-y-3 text-sm">
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  to="#"
                >
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Centro Assistenza
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  to="#"
                >
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  to="#"
                >
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contattaci
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Giammarco De Lauretis. Tutti i diritti riservati.
            </p>
            <div className="flex gap-6 text-sm">
              <Link 
                to="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link 
                to="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Termini di Servizio
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link 
                to="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;