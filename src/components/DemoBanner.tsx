import { Sparkles, X } from "lucide-react";
import { disableDemoMode } from "@/hooks/useDemoMode";

export function DemoBanner() {
  const handleExit = () => {
    disableDemoMode();
    window.location.reload();
  };

  return (
    <div className="relative z-50 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-4 py-2.5 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Mode Démo
        </div>
        <span className="text-sm font-medium opacity-90">
          Vous explorez AcmeSync CRM avec des données fictives — aucune modification n'est sauvegardée.
        </span>
      </div>
      <button
        onClick={handleExit}
        className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 transition-colors rounded-full px-3 py-1.5 font-medium"
      >
        <X className="w-3.5 h-3.5" />
        Quitter la démo
      </button>
    </div>
  );
}
