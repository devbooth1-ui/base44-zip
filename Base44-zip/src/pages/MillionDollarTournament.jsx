
import React from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, MapPin, DollarSign, Users, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MillionDollarTournament() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="text-center">
          <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            $1 MILLION SHOOTOUT
          </h1>
          <p className="text-slate-400">Bi-Annual Championship Tournaments</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40 rounded-2xl p-6">
          <div className="text-center mb-4">
            <div className="text-6xl font-black text-yellow-400 mb-2">$1,000,000</div>
            <div className="text-xl text-white font-bold">GRAND PRIZE</div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6" />
              How to Qualify
            </h2>
            <div className="space-y-3 text-slate-300">
              <p className="flex items-start gap-2">
                <span className="text-lime-400 font-bold">•</span>
                <span>Earn points by playing Par3 Challenge holes throughout the year</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lime-400 font-bold">•</span>
                <span>Top point earners receive automatic invitations</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lime-400 font-bold">•</span>
                <span>Any hole-in-one earns instant qualification</span>
              </p>
            </div>
          </div>

          <div className="h-px bg-slate-700" />

          <div>
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Tournament Details
            </h2>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">When</div>
                  <div className="text-sm text-slate-400">Bi-annual events - Spring & Fall</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Where</div>
                  <div className="text-sm text-slate-400">Myrtle Beach, SC & Orlando, FL</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Format</div>
                  <div className="text-sm text-slate-400">Head-to-head elimination on challenging par 3 holes</div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-700" />

          <div>
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Prize Structure
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30">
                <span className="font-bold">🥇 1st Place</span>
                <span className="text-2xl font-black text-yellow-400">$1,000,000</span>
              </div>
              <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                <span className="font-bold">🥈 2nd Place</span>
                <span className="text-xl font-bold text-slate-300">$100,000</span>
              </div>
              <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                <span className="font-bold">🥉 3rd Place</span>
                <span className="text-xl font-bold text-slate-300">$50,000</span>
              </div>
              <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                <span className="text-sm">Top 10 Finishers</span>
                <span className="font-bold text-slate-300">Cash Prizes</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate(createPageUrl("TournamentDetails"))}
          className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-900 font-bold py-6 text-lg rounded-xl"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Click Here for Details
        </Button>

        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 text-center">
          <p className="text-slate-300 text-sm">
            Keep playing and accumulating points to secure your spot in the tournament of a lifetime!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
