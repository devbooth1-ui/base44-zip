import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Trophy, Gift } from "lucide-react";

export default function HowItsPlayed() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course_id');

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const courses = await base44.entities.Course.filter({ id: courseId });
      return courses[0];
    },
    enabled: !!courseId
  });

  const handleNewPlayer = () => {
    localStorage.removeItem('par3_current_player');
    if (course) {
      navigate(createPageUrl("PlayerVerify") + `?course_id=${course.id}`);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1920&q=80')"
        }}
      />
      <div className="fixed inset-0 bg-black/30" />

      {/* Logo */}
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/3ad430bee_image.png" 
        alt="Par3 Challenge" 
        className="absolute left-1/2 -translate-x-1/2 w-28 h-auto drop-shadow-2xl z-10"
        style={{ top: 60 }}
      />
      
      {/* Title */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 text-center" style={{ top: 140 }}>
        <h1 className="text-lg font-black text-orange-500 drop-shadow-xl mb-0.5">
          HOW IT'S PLAYED
        </h1>
        {course && (
          <p className="text-white text-xs font-bold">
            {course.course_name} • Hole #{course.hole_number}
          </p>
        )}
      </div>

      {/* Rules Box */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 200 }}>
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/30 shadow-2xl">
          {course ? (
            <ul className="space-y-2 text-white text-xs">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Login, pay <span className="font-bold">${course.entry_fee}</span> entry fee and tee off.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Follow all prompts for verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">💰</span>
                <span><span className="font-bold text-yellow-400">Birdie</span> wins <span className="font-bold">$65 + 200 points</span> Towards $1M Shootout</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">🏆</span>
                <span><span className="font-bold text-yellow-400">Hole in One</span> wins <span className="font-bold">$1000 + 800 points + Auto Entry to $1M Shootout</span></span>
              </li>
            </ul>
          ) : (
            <p className="text-white text-xs">Loading rules...</p>
          )}
        </div>
      </div>

      {/* Awards Info Button */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 360 }}>
        <Button
          onClick={() => navigate(createPageUrl("AwardsInfo") + `?course_id=${courseId}`)}
          className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold py-2.5 text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 border border-amber-400/50"
        >
          <Gift className="w-5 h-5" />
          View Awards Details
        </Button>
      </div>

      {/* Tournament Button */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 420 }}>
        <Button
          onClick={() => navigate(createPageUrl("MillionDollarTournament"))}
          className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-2.5 text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 border border-white/20"
        >
          <Trophy className="w-5 h-5" />
          $1M Tournament Details
        </Button>
      </div>

      {/* Let's Play Button */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 480 }}>
        <Button
          onClick={handleNewPlayer}
          className="w-full bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 text-white font-black py-3 text-lg rounded-xl shadow-2xl border border-emerald-500/50"
        >
          Let's Play!
        </Button>
      </div>

      {/* Back Button */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 540 }}>
        <Button
          onClick={() => navigate(createPageUrl("Home"))}
          variant="ghost"
          className="w-full text-white hover:text-white/80 text-xs py-2"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}