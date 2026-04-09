import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X, User, Stethoscope, FileText, ArrowRight } from "lucide-react";
import { doctors, departments } from "@/data";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  type: "doctor" | "department" | "service";
  path: string;
  description: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];

    // Search Doctors
    doctors.forEach(doc => {
      if (doc.name.toLowerCase().includes(query.toLowerCase()) || 
          doc.specialty.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: doc.id,
          title: doc.name,
          type: "doctor",
          path: `/doctors?dept=${doc.departmentId}`,
          description: doc.specialty
        });
      }
    });

    // Search Departments
    departments.forEach(dept => {
      if (dept.name.toLowerCase().includes(query.toLowerCase()) || 
          dept.description.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: dept.id,
          title: dept.name,
          type: "department",
          path: `/departments`,
          description: dept.description
        });
      }
    });

    setResults(searchResults.slice(0, 6));
    setIsOpen(true);
  }, [query]);

  const handleSelect = (path: string) => {
    setQuery("");
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search doctors, departments..."
          className="pl-10 pr-10 rounded-full bg-slate-100 border-none focus-visible:ring-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border overflow-hidden z-[100]"
          >
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result.path)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group"
                >
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    {result.type === "doctor" ? (
                      <User className="h-5 w-5 text-primary" />
                    ) : (
                      <Stethoscope className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-slate-900 truncate">{result.title}</p>
                    <p className="text-xs text-slate-500 truncate">{result.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
            <div className="bg-slate-50 p-2 text-center border-t">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Search Results for "{query}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
