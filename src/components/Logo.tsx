import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export default function Logo({ className, iconClassName, textClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20", iconClassName)}>
        <Activity className="h-6 w-6" />
      </div>
      <div className={cn("flex flex-col leading-none", textClassName)}>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Kalyani<span className="text-primary">Hospital</span>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
          Care & Compassion
        </span>
      </div>
    </div>
  );
}
