import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";

export default function TournamentDetails() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("MillionDollarTournament"))}
          className="text-slate-400 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center">
          <h1 className="text-3xl font-black mb-2 text-lime-400">Tournament Details</h1>
          <p className="text-slate-400">Full details coming soon...</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
          <p className="text-slate-300">
            Detailed tournament information will be available here.
          </p>
        </div>
      </motion.div>
    </div>
  );
}