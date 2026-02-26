import { useState } from "react";
import { Menu, X, Home, Users, Building2, Calendar, MessageSquare, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router";
import miologo from "@/assets/asa5.jpg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const now = new Date();
  const formatted = now.toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const navItems = [
    { path: "/utenti", label: "Users", icon: Users },
    { path: "/abitazioni", label: "Residences", icon: Building2 },
    { path: "/prenotazioni", label: "Reservations", icon: Calendar },
    { path: "/hosts", label: "Hosts", icon: Home },
    { path: "/feedbacks", label: "Feedbacks", icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src={miologo}
              alt="Logo Turista"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
            />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary rounded-full border-2 border-background flex items-center justify-center">
              <LayoutDashboard className="h-2.5 w-2.5 text-primary-foreground" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight">Turista Facoltoso</h1>
            <p className="text-xs text-muted-foreground">Back-Office</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <NavigationMenuItem key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      group inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }
                    `}
                  >
                    <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${active ? "" : "text-muted-foreground"}`} />
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {open ? (
                  <X className="h-5 w-5 transition-transform rotate-90" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              {/* Mobile Header */}
              <div className="flex items-center gap-3 pb-6 border-b">
                <img
                  src={miologo}
                  alt="Logo"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <h2 className="font-semibold">Turista Facoltoso</h2>
                  <p className="text-xs text-muted-foreground">Back-Office Dashboard</p>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="flex flex-col gap-2 pt-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
                <span className="text-s text-muted-foreground">Data: {formatted}</span>
              </div>

              {/* Mobile Footer */}
              <div className="absolute bottom-6 left-6 right-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  © 2024 Giammarco De Lauretis
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
} 