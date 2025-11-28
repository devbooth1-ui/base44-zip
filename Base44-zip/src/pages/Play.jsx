import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Play() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course_id');

  const [score, setScore] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const courses = await base44.entities.Course.filter({ id: courseId });
      return courses[0];
    },
    enabled: !!courseId
  });

  const { data: recentPlay } = useQuery({
    queryKey: ['recent-play', currentPlayer?.id, courseId],
    queryFn: async () => {
      const plays = await base44.entities.Play.filter({
        player_id: currentPlayer.id,
        course_id: courseId,
        payment_status: "paid"
      }, "-created_date", 1);
      return plays[0];
    },
    enabled: !!currentPlayer && !!courseId
  });

  useEffect(() => {
    const stored = localStorage.getItem('par3_current_player');
    if (stored) {
      setCurrentPlayer(JSON.parse(stored));
    }
  }, []);

  const updatePlayMutation = useMutation({
    mutationFn: async ({ playId, score, result }) => {
      await base44.entities.Play.update(playId, {
        score,
        result,
        points_earned: result === "hole_in_one" ? 800 : result === "birdie" ? 200 : result === "par" ? 50 : 0
      });

      const updates = {
        last_played_date: new Date().toISOString()
      };
      
      if (result === "hole_in_one") {
        updates.total_hios = (currentPlayer.total_hios || 0) + 1;
        updates.total_points = (currentPlayer.total_points || 0) + 800;
        updates.qualified_for_shootout = true;
      } else if (result === "birdie") {
        updates.total_birdies = (currentPlayer.total_birdies || 0) + 1;
        updates.total_points = (currentPlayer.total_points || 0) + 200;
      } else if (result === "par") {
        updates.total_points = (currentPlayer.total_points || 0) + 50;
      }

      await base44.entities.Player.update(currentPlayer.id, updates);
      
      return { score, result };
    },
    onSuccess: ({ score, result }) => {
      queryClient.invalidateQueries(['recent-play']);
      if (result === "hole_in_one" || result === "birdie") {
        navigate(createPageUrl("AttireVerification") + `?play_id=${recentPlay.id}`);
      } else {
        toast.success("Score recorded!");
        setTimeout(() => navigate(createPageUrl("Scorecard")), 1500);
      }
    }
  });

  const handleScoreSubmit = (selectedScore) => {
    setScore(selectedScore);
    
    let result = "other";
    if (selectedScore === 1) result = "hole_in_one";
    else if (selectedScore === 2) result = "birdie";
    else if (selectedScore === 3) result = "par";
    else if (selectedScore === 4) result = "shankd_it";

    updatePlayMutation.mutate({
      playId: recentPlay.id,
      score: selectedScore,
      result
    });
  };

  if (!course || !recentPlay) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-lime-400" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Golf Grass Background */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://raw.githubusercontent.com/devbooth1-ui/par3-challenge-app-tailwind/main/public/golf-grass.jpg')"
        }}
      />
      <div className="fixed inset-0 bg-black/20" />

      {/* Logo at top */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/3ad430bee_image.png" 
          alt="Par3 Challenge" 
          className="w-32 h-auto drop-shadow-2xl"
        />
      </div>

      <div className="relative h-full flex items-center justify-center px-4"
  >

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-black mb-1 text-white">
            How'd Ya Do?
          </h1>
        </div>

        <div className="space-y-3">
          <div className="text-xs text-lime-400 font-semibold text-center">
            <span className="bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
              YOUR PICK
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { score: 1, label: "Hole-in-One!", emoji: "🏆", color: "from-yellow-500 to-orange-500" },
              { score: 2, label: "Birdie", emoji: "🎯", color: "from-lime-500 to-emerald-500" },
              { score: 3, label: "Par", emoji: "⛳", color: "from-blue-500 to-cyan-500" },
              { score: 4, label: "Shank'd it", emoji: "🏌️", color: "from-slate-600 to-slate-700" },
            ].map((option) => (
              <Button
                key={option.score}
                onClick={() => handleScoreSubmit(option.score)}
                disabled={updatePlayMutation.isPending}
                className={`h-28 flex flex-col items-center justify-center gap-1 bg-gradient-to-br ${option.color} hover:opacity-90 text-white rounded-xl`}
              >
                <span className="text-3xl">{option.emoji}</span>
                <span className="text-sm font-bold">{option.label}</span>
                <span className="text-xs opacity-80">Score: {option.score}</span>
              </Button>
            ))}
          </div>

          {score && score > 4 && (
            <div className="space-y-2">
              <input
                type="number"
                min="5"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-center text-white"
                placeholder="Enter score..."
              />
              <Button
                onClick={() => handleScoreSubmit(score)}
                disabled={updatePlayMutation.isPending}
                className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 text-slate-900 font-bold py-3"
              >
                Submit Score
              </Button>
            </div>
          )}
        </div>

        {updatePlayMutation.isPending && (
          <div className="text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-lime-400 mx-auto mb-2" />
            Recording your score...
          </div>
        )}

        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 text-xs">
          <div className="font-bold text-lime-400 mb-1">📹 Camera Verification</div>
          <p className="text-white font-bold">
            Your play has been captured by our on-course cameras. 
            All prize claims will be verified before payout.
          </p>
        </div>
      </motion.div>
      </div>
    </div>
  );
}