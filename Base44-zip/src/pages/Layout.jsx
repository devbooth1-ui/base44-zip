
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { MoreVertical, Trophy, History, Sparkles, ClipboardCheck, Home, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);
  
  // Only show shot recording indicator on Play page
  const showShotRecording = currentPageName === "Play";
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white">
      {/* Shot Recording Indicator - Only on Play page */}
      {showShotRecording && (
        <div className="fixed top-3 left-3 z-50 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full border border-red-500/30">
          <div className="relative flex items-center justify-center">
            <div 
              className="w-1.5 h-1.5 bg-red-500 rounded-full"
              style={{ 
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }} 
            />
          </div>
          <span className="text-[10px] text-red-400 font-semibold">SHOT REC</span>
        </div>
      )}
      
      {/* Three Dot Menu - Top Right - Always Visible */}
      <div className="fixed top-3 right-3 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2.5 hover:bg-white/10 rounded-full transition-all backdrop-blur-md border border-white/20 shadow-lg">
              <MoreVertical className="w-6 h-6 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-slate-900/95 backdrop-blur-md border-emerald-500/40 shadow-2xl">
            <DropdownMenuItem 
              onClick={() => navigate(createPageUrl("Home"))}
              className="cursor-pointer text-slate-300 hover:text-lime-400 hover:bg-emerald-500/20 py-3 text-base"
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate(createPageUrl("Wallet"))}
              className="cursor-pointer text-slate-300 hover:text-lime-400 hover:bg-emerald-500/20 py-3 text-base"
            >
              <History className="w-5 h-5 mr-3" />
              My History & Scorecard
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate(createPageUrl("ClaimsStatus"))}
              className="cursor-pointer text-slate-300 hover:text-lime-400 hover:bg-emerald-500/20 py-3 text-base"
            >
              <ClipboardCheck className="w-5 h-5 mr-3" />
              Claims Status
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate(createPageUrl("Leaderboard"))}
              className="cursor-pointer text-slate-300 hover:text-lime-400 hover:bg-emerald-500/20 py-3 text-base"
            >
              <Trophy className="w-5 h-5 mr-3" />
              Leaderboard
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate(createPageUrl("MillionDollarTournament"))}
              className="cursor-pointer text-slate-300 hover:text-lime-400 hover:bg-emerald-500/20 py-3 text-base"
            >
              <Sparkles className="w-5 h-5 mr-3" />
              $1M Tournament
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <div className="border-t border-slate-700 my-2" />
                <DropdownMenuItem 
                  onClick={() => navigate(createPageUrl("AdminCRM"))}
                  className="cursor-pointer text-yellow-300 hover:text-yellow-400 hover:bg-yellow-500/20 py-3 text-base"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Admin: Courses
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate(createPageUrl("AdminPlayers"))}
                  className="cursor-pointer text-yellow-300 hover:text-yellow-400 hover:bg-yellow-500/20 py-3 text-base"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Admin: Players
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate(createPageUrl("CameraVerification"))}
                  className="cursor-pointer text-yellow-300 hover:text-yellow-400 hover:bg-yellow-500/20 py-3 text-base"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Admin: Verification
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate(createPageUrl("AdminAccounting"))}
                  className="cursor-pointer text-yellow-300 hover:text-yellow-400 hover:bg-yellow-500/20 py-3 text-base"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Admin: Accounting
                </DropdownMenuItem>
              </>
            )}
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <main>
        {children}
      </main>
    </div>
  );
}
