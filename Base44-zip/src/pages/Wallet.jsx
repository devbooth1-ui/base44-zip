import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Target, Sparkles, Calendar, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function Wallet() {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('par3_current_player');
    if (stored) {
      setCurrentPlayer(JSON.parse(stored));
    }
  }, []);

  const { data: player, isLoading: playerLoading } = useQuery({
    queryKey: ['player', currentPlayer?.id],
    queryFn: async () => {
      const players = await base44.entities.Player.filter({ id: currentPlayer.id });
      return players[0];
    },
    enabled: !!currentPlayer
  });

  const { data: plays } = useQuery({
    queryKey: ['player-plays', currentPlayer?.id],
    queryFn: () => base44.entities.Play.filter({ player_id: currentPlayer.id }, "-created_date"),
    initialData: [],
    enabled: !!currentPlayer
  });

  if (!currentPlayer || playerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-lime-400" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-auto">
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1920&q=80')"
        }}
      />
      <div className="fixed inset-0 bg-black/60" />

      <div className="relative min-h-full flex flex-col items-center px-4 py-8">
        {/* Logo */}
        <motion.img
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/3ad430bee_image.png"
          alt="Par3 Challenge"
          className="w-36 h-auto drop-shadow-2xl mb-6"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md space-y-4"
        >
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-black text-white">My History</h1>
            <p className="text-lime-400 font-bold">{player?.full_name}</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <Sparkles className="w-4 h-4 text-lime-400 mx-auto mb-1" />
              <div className="text-xl font-black text-white">{player?.total_points || 0}</div>
              <div className="text-[10px] text-slate-300">Points</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <Target className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-xl font-black text-white">{player?.total_birdies || 0}</div>
              <div className="text-[10px] text-slate-300">Birdies</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <div className="text-xl font-black text-white">{player?.total_hios || 0}</div>
              <div className="text-[10px] text-slate-300">HIOs</div>
            </div>
          </div>

          {/* Recent Plays */}
          <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-lime-400" />
              Recent Plays
            </h2>
            
            {plays.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No plays yet. Get out there!</p>
            ) : (
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {plays.slice(0, 20).map((play) => (
                  <div 
                    key={play.id} 
                    className="bg-white/10 border border-white/10 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{play.course_name}</div>
                      <div className="text-xs text-slate-400">
                        Hole #{play.hole_number} • {new Date(play.play_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl">
                        {play.result === 'hole_in_one' ? "🏆" : 
                         play.result === 'birdie' ? "🎯" : 
                         play.result === 'par' ? "⛳" : "🏌️"}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {play.result?.replace("_", " ").replace("shankd", "shank'd")}
                      </div>
                      {play.points_earned > 0 && (
                        <div className="text-[10px] text-lime-400 font-bold">
                          +{play.points_earned} pts
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back to Home */}
          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            variant="ghost"
            className="w-full text-white/70 hover:text-white hover:bg-white/10"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}