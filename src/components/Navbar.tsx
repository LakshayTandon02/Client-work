import { Link, useLocation } from "react-router-dom";
import { hospitalDetails } from "@/data";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Departments", path: "/departments" },
  { name: "Doctors", path: "/doctors" },
  { name: "Contact", path: "/contact" },
];

import SearchBar from "./SearchBar";
import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center shrink-0">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-grow justify-center max-w-md">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (
              <Link
                to="/profile"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                  location.pathname === "/profile"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                My Bookings
              </Link>
            )}
            
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "text-sm font-bold transition-colors text-orange-600 hover:text-orange-700",
                  location.pathname === "/admin" ? "underline underline-offset-4" : ""
                )}
              >
                Admin
              </Link>
            )}

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="hidden lg:flex flex-col items-end hover:opacity-80 transition-opacity">
                    <span className="text-xs font-bold text-slate-900 leading-none">{user.displayName || "User"}</span>
                    <span className="text-[10px] text-slate-500">{user.email}</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button render={<Link to="/auth" />} variant="outline" size="sm">
                  Sign In
                </Button>
              )}
              <Button render={<Link to="/appointment" />} size="sm">
                Book Appointment
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium",
                  location.pathname === "/profile"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                My Bookings
              </Link>
            )}
            <div className="px-3 py-2">
              <Button className="w-full" render={<Link to="/appointment" />} onClick={() => setIsOpen(false)}>
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
