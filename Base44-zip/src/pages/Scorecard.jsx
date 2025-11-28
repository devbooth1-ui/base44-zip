import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Trophy, Target, Clock, DollarSign } from "lucide-react";

export default function Scorecard() {
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const { data: player } = useQuery({
    queryKey: ['player', currentPlayer?.id],
    queryFn: async () => {
      const players = await base44.entities.Player.filter({ id: currentPlayer.id });
      return players[0];
    },
    enabled: !!currentPlayer,
  });

  const { data: recentPlay } = useQuery({
    queryKey: ['recent-play', currentPlayer?.id],
    queryFn: async () => {
      const plays = await base44.entities.Play.filter(
        { player_id: currentPlayer.id },
        '-created_date',
        1
      );
      return plays[0];
    },
    enabled: !!currentPlayer,
  });

  useEffect(() => {
    const stored = localStorage.getItem('par3_current_player');
    if (stored) {
      setCurrentPlayer(JSON.parse(stored));
    }
  }, []);

  const playerPoints = player?.total_points || 0;
  const shootoutPointsGoal = 800;
  const progressPercent = Math.min((playerPoints / shootoutPointsGoal) * 100, 100);

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950">
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
      <div className="fixed inset-0 bg-black/50" />

      <div className="relative min-h-full flex flex-col items-center px-4 pt-4 pb-6">
        {/* Logo */}
        <motion.img
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/4a47e2fe5_par3logo.png"
          alt="Par3 Challenge"
          className="w-32 h-auto drop-shadow-2xl mb-2"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md space-y-3"
        >
          {/* Thanks Message */}
          <div className="text-center">
            <h1 className="text-xl font-black text-white mb-0">
              Thanks for playing today!
            </h1>
            <p className="text-lime-400 font-bold text-base">
              {player.full_name}
            </p>
          </div>

          {/* Claim Submitted Notice - Only for Birdie/HIO */}
          {recentPlay && (recentPlay.result === 'birdie' || recentPlay.result === 'hole_in_one') && (
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-xl p-3 border border-green-500/40">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-400" />
                <h2 className="text-green-400 font-bold text-base">Claim Submitted!</h2>
              </div>

              {recentPlay.result === 'birdie' ? (
                <div className="space-y-1 text-center">
                  <p className="text-white text-xs">
                    Your <span className="text-lime-400 font-bold">birdie</span> claim is being verified.
                  </p>
                  <p className="text-slate-300 text-[10px]">
                    Verification typically within <span className="text-yellow-400 font-bold">1 hour</span>.
                  </p>
                  <div className="bg-black/30 rounded-lg p-2 mt-2">
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="w-3 h-3 text-lime-400" />
                      <span className="text-lime-400 font-bold text-base">$65 Prize</span>
                    </div>
                    <p className="text-slate-300 text-[10px]">
                      Redeemable at the pro shop upon verification
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <p className="text-white text-xs">
                    Your <span className="text-yellow-400 font-bold">hole-in-one</span> claim is being verified!
                  </p>
                  <p className="text-slate-300 text-[10px]">
                    Verification typically within <span className="text-yellow-400 font-bold">24 hours</span>.
                  </p>
                  <div className="bg-black/30 rounded-lg p-2 mt-2">
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400 font-bold text-base">$1,000 Prize</span>
                    </div>
                    <p className="text-slate-300 text-[10px]">
                      Paid directly to you upon verification
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats Summary */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/30">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <Sparkles className="w-4 h-4 text-lime-400 mx-auto mb-0.5" />
                <div className="text-lg font-black text-white">{player.total_points || 0}</div>
                <div className="text-[9px] text-slate-300">Points</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <Target className="w-4 h-4 text-blue-400 mx-auto mb-0.5" />
                <div className="text-lg font-black text-white">{player.total_birdies || 0}</div>
                <div className="text-[9px] text-slate-300">Birdies</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-0.5" />
                <div className="text-lg font-black text-white">{player.total_hios || 0}</div>
                <div className="text-[9px] text-slate-300">HIOs</div>
              </div>
            </div>
          </div>

          {/* $1M Shootout Progress */}
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-md rounded-xl p-3 border border-yellow-500/30">
            <h2 className="text-yellow-400 font-black text-base mb-1 flex items-center justify-center">
              <Trophy className="w-4 h-4 mr-1" />
              $1 MILLION SHOOTOUT
            </h2>
            <p className="text-white text-xs text-center mb-2">
              Earn <span className="font-bold text-yellow-400">{shootoutPointsGoal} points</span> to qualify!
            </p>

            {/* Progress Bar */}
            <div className="relative h-6 bg-slate-800/80 rounded-full overflow-hidden mb-1 border border-slate-600">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-black text-xs drop-shadow-lg">
                  {playerPoints} / {shootoutPointsGoal} pts
                </span>
              </div>
            </div>

            {playerPoints >= shootoutPointsGoal ? (
              <p className="text-lime-400 font-bold text-center text-xs mt-1">
                🎉 You've QUALIFIED for the $1M Shootout!
              </p>
            ) : (
              <p className="text-slate-300 text-[10px] text-center mt-1">
                Only <span className="text-yellow-400 font-bold">{shootoutPointsGoal - playerPoints} more points</span> to qualify!
              </p>
            )}
          </div>

          {/* Tournament Details Button */}
          <Button
            onClick={() => navigate(createPageUrl("MillionDollarTournament"))}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 font-black py-3 text-base rounded-xl shadow-lg flex items-center justify-center"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Tournament Details
          </Button>

          {/* Back to Home */}
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Home"))}
            className="w-full text-slate-300 hover:text-white py-2 text-sm"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}