import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Video, Trophy, Target, Sparkles } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [testMode, setTestMode] = useState(null); // null = auto, 'new' = force new, 'returning' = force returning

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.filter({ is_active: true }),
    initialData: []
  });

  const { data: player } = useQuery({
    queryKey: ['player', currentPlayer?.id],
    queryFn: async () => {
      const players = await base44.entities.Player.filter({ id: currentPlayer.id });
      return players[0];
    },
    enabled: !!currentPlayer
  });

  useEffect(() => {
    const stored = localStorage.getItem('par3_current_player');
    if (stored) {
      setCurrentPlayer(JSON.parse(stored));
    }
  }, []);

  const course = courses[0];

  const handleNewPlayer = () => {
    localStorage.removeItem('par3_current_player');
    setCurrentPlayer(null);
    if (course) {
      navigate(createPageUrl("PlayerVerify") + `?course_id=${course.id}`);
    }
  };

  const handleLetsPlay = () => {
    if (course) {
      navigate(createPageUrl("Payment") + `?course_id=${course.id}`);
    }
  };

  // Test mode toggle component
  const TestModeToggle = () => (
    <div className="absolute top-2 left-2 z-20 flex gap-1">
      <Button
        onClick={() => setTestMode(testMode === 'new' ? null : 'new')}
        className={`text-[10px] px-2 py-1 h-auto rounded-md font-bold ${testMode === 'new' ? 'bg-blue-600' : 'bg-slate-600/80'}`}
      >
        New
      </Button>
      <Button
        onClick={() => setTestMode(testMode === 'returning' ? null : 'returning')}
        className={`text-[10px] px-2 py-1 h-auto rounded-md font-bold ${testMode === 'returning' ? 'bg-green-600' : 'bg-slate-600/80'}`}
      >
        Return
      </Button>
    </div>
  );

  // Determine which view to show
  const showReturningView = testMode === 'returning' || (testMode !== 'new' && currentPlayer && player);

  // Returning Player View
  if (showReturningView && player) {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1920&q=80')"
          }}
        />
        <div className="fixed inset-0 bg-black/20" />

        <TestModeToggle />

        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/3ad430bee_image.png" 
          alt="Par3 Challenge" 
          className="absolute left-1/2 -translate-x-1/2 w-44 h-auto drop-shadow-2xl z-10"
          style={{ top: 60 }}
        />

        <div className="absolute left-1/2 -translate-x-1/2 z-10 text-center" style={{ top: 200 }}>
          <h1 className="text-2xl font-black text-white drop-shadow-2xl mb-1">
            Welcome Back!
          </h1>
          <p className="text-lg text-lime-400 font-bold drop-shadow-lg">
            {player.full_name}
          </p>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 280 }}>
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-2xl space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <Sparkles className="w-5 h-5 text-lime-400 mx-auto mb-1" />
                <div className="text-xl font-black text-white">{player.total_points || 0}</div>
                <div className="text-[10px] text-slate-300">Points</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-xl font-black text-white">{player.total_birdies || 0}</div>
                <div className="text-[10px] text-slate-300">Birdies</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-xl font-black text-white">{player.total_hios || 0}</div>
                <div className="text-[10px] text-slate-300">HIOs</div>
              </div>
            </div>

            {course && (
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-white/70 text-xs font-semibold mb-1">Today's Challenge</p>
                <h3 className="text-xl font-black text-white mb-0.5">{course.course_name}</h3>
                <p className="text-white/90 text-sm font-semibold">
                  Hole #{course.hole_number} • {course.yardage} yards
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10 space-y-3" style={{ bottom: 100 }}>
          <Button
            onClick={handleLetsPlay}
            className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-900 font-black py-6 text-xl rounded-xl shadow-2xl"
          >
            Let's Play!
          </Button>
          
          <Button
            onClick={() => navigate(createPageUrl("AwardsInfo") + `?course_id=${course?.id}`)}
            variant="outline"
            className="w-full border-2 border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 text-base rounded-xl"
          >
            Review Awards
          </Button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ bottom: 12 }}>
          <div className="bg-green-800/40 backdrop-blur-sm rounded-lg p-1 text-center border border-white/20">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Video className="w-2.5 h-2.5 text-white" />
              <h5 className="text-white font-bold text-[9px]">Shot Verification Active</h5>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-white text-[8px]">
              <span>✓ Fair Play</span>
              <span>✓ Memories</span>
              <span>✓ Proof</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // New Player View
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1920&q=80')"
        }}
      />
      <div className="fixed inset-0 bg-black/20" />

      <TestModeToggle />

      {/* Logo */}
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/3ad430bee_image.png" 
        alt="Par3 Challenge" 
        className="absolute left-1/2 -translate-x-1/2 w-52 h-auto drop-shadow-2xl z-10"
        style={{ top: 100 }}
      />

      {/* Top Section */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 text-center whitespace-nowrap" style={{ top: 240 }}>
        <h1 className="text-xl font-black text-white drop-shadow-2xl tracking-wider mb-1">
          PAY <span className="text-yellow-400">•</span> PLAY <span className="text-yellow-400">•</span> WIN
        </h1>
        <h2 className="text-sm font-black text-white drop-shadow-2xl">
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent text-2xl">$1000</span> Today <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent text-2xl">$1 Million</span> Tomorrow
        </h2>
      </div>

      {/* Center Box */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 320 }}>
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-2xl mb-4">
          {course ? (
            <>
              <p className="text-white/70 text-xs font-semibold text-center mb-1">Your Hole Today...</p>
              <h3 className="text-2xl font-black text-white text-center mb-1">{course.course_name}</h3>
              <p className="text-white/90 text-base font-semibold text-center">
                Hole #{course.hole_number} • {course.yardage} yards
              </p>
            </>
          ) : (
            <p className="text-white text-sm text-center">Loading course...</p>
          )}
        </div>

        <Button
          onClick={() => navigate(createPageUrl("HowItsPlayed") + `?course_id=${course?.id}`)}
          className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-black py-4 text-lg rounded-xl shadow-2xl border border-amber-400/50"
        >
          How It's Played
        </Button>
      </div>

      {/* Bottom Section */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ bottom: 12 }}>
        <div className="bg-green-800/40 backdrop-blur-sm rounded-lg p-1 text-center border border-white/20">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Video className="w-2.5 h-2.5 text-white" />
            <h5 className="text-white font-bold text-[9px]">Shot Verification Active</h5>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-white text-[8px]">
            <span>✓ Fair Play</span>
            <span>✓ Memories</span>
            <span>✓ Proof</span>
          </div>
        </div>
      </div>
          </div>
          );
          }