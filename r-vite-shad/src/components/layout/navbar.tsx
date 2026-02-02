import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "react-router";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-background">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"} className="text-lg font-semibold">Back-Office</Link>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
                <Link to={"/utenti"}>Users</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              
                <Link to={"/abitazioni"}>Homes</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link to={"/prenotazioni"}>Reservations</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link to={"/hosts"}>Hosts</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-6 pt-6">
                <Link to={"/"} className="text-sm font-medium" onClick={() => setOpen(false)}>
                  Home
                </Link>
                <Link to={"/abitazioni"} className="text-sm font-medium" onClick={() => setOpen(false)}>
                  Homes
                </Link>
                <Link to={"/prenotazioni"} className="text-sm font-medium" onClick={() => setOpen(false)}>
                  Reservations
                </Link>
                <Link to={"/Hosts"} className="text-sm font-medium" onClick={() => setOpen(false)}>
                  Hosts
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
