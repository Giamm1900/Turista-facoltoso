import { Home, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

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

          {/* Link Rapidi */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Esplora
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Cerca Abitazioni</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Offerte Speciali</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Diventa Host</a></li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Contatti
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Via Roma 123, Italia
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +39 012 345 6789
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> info@stayhub.it
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Seguici
            </h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} StayHub Inc. Tutti i diritti riservati.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Termini di Servizio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;