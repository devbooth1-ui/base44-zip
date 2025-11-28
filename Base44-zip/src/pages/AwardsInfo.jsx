import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Trophy, Target, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AwardsInfo() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course_id');
  
  const [hioTop, setHioTop] = useState(200);
  const [birdieTop, setBirdieTop] = useState(280);
  const [parTop, setParTop] = useState(360);
  const [detailsTop, setDetailsTop] = useState(440);
  const [buttonTop, setButtonTop] = useState(530);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Golf Course Background */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/1cf0e615c_image.png')",
          zIndex: 0,
          backgroundSize: 'cover'
        }}
      />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-0" />

      {/* Logo */}
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/3ad430bee_image.png" 
        alt="Par3 Challenge" 
        className="absolute left-1/2 -translate-x-1/2 w-28 h-auto drop-shadow-2xl z-10"
        style={{ top: 100 }}
      />

      {/* Title */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 text-center" style={{ top: 165 }}>
        <h1 className="text-xl font-black text-lime-400 mb-0.5">The Awards</h1>
        <p className="text-slate-300 text-xs">Here's what you're playing for</p>
      </div>

      {/* Hole-in-One */}
      <motion.div
        drag
        dragMomentum={false}
        className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-3 cursor-move z-10"
        style={{ top: hioTop }}
        onDragEnd={(e, info) => setHioTop(hioTop + info.offset.y)}
      >
        <div className="bg-slate-800/90 border border-slate-700/50 rounded-lg p-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="bg-slate-600 rounded-full p-1.5">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-black text-white">Hole-in-One</h2>
          </div>
          <div className="space-y-0.5 text-white text-xs">
            <p className="font-bold">Prize: $1,000 cash*</p>
            <p>• 800 reward points</p>
            <p>• Automatic entry to $1 Million Shootout!</p>
          </div>
        </div>
      </motion.div>

      {/* Birdie */}
      <motion.div
        drag
        dragMomentum={false}
        className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-3 cursor-move z-10"
        style={{ top: birdieTop }}
        onDragEnd={(e, info) => setBirdieTop(birdieTop + info.offset.y)}
      >
        <div className="bg-slate-800/90 border border-slate-700/50 rounded-lg p-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="bg-slate-600 rounded-full p-1.5">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-black text-white">Birdie</h2>
          </div>
          <div className="space-y-0.5 text-white text-xs">
            <p className="font-bold">Prize: $65.00 Club Card</p>
            <p>• 200 points toward $1M shoot-out!</p>
          </div>
        </div>
      </motion.div>

      {/* Par */}
      <motion.div
        drag
        dragMomentum={false}
        className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-3 cursor-move z-10"
        style={{ top: parTop }}
        onDragEnd={(e, info) => setParTop(parTop + info.offset.y)}
      >
        <div className="bg-slate-800/90 border border-slate-700/50 rounded-lg p-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="bg-slate-600 rounded-full p-1.5">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-black text-white">Par (or not up to par)</h2>
          </div>
          <div className="space-y-0.5 text-white text-xs">
            <p>• 50 reward points toward $1M shoot-out</p>
          </div>
        </div>
      </motion.div>

      {/* Tournament Details */}
      <motion.div
        drag
        dragMomentum={false}
        className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-3 cursor-move z-10"
        style={{ top: detailsTop }}
        onDragEnd={(e, info) => setDetailsTop(detailsTop + info.offset.y)}
      >
        <div className="bg-slate-800/90 border border-slate-700/50 rounded-lg p-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <h3 className="text-sm font-bold text-white">Tournament Details</h3>
          </div>
          <p className="text-white text-xs leading-snug">
            800 points qualifies for one shot. 1400 points gets 2 balls in our annual $1 Million Shoot-Out tournament.
          </p>
        </div>
      </motion.div>

      {/* Tee it up Button */}
      <motion.div
        drag
        dragMomentum={false}
        className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-3 cursor-move z-10"
        style={{ top: buttonTop }}
        onDragEnd={(e, info) => setButtonTop(buttonTop + info.offset.y)}
      >
        <Button
          onClick={() => navigate(createPageUrl("Payment") + `?course_id=${courseId}`)}
          className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-900 font-black py-4 text-lg rounded-lg shadow-xl h-12"
        >
          Tee it up!
        </Button>
        <p className="text-xs text-slate-500 text-center pt-1">
          * Prizes subject to verification and terms & conditions
        </p>
      </motion.div>
    </div>
  );
}