import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Target } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Leaderboard() {
  const { data: topByPoints, isLoading: loadingPoints } = useQuery({
    queryKey: ['leaderboard-points'],
    queryFn: async () => {
      const players = await base44.entities.Player.list("-total_points", 50);
      return players.filter(p => p.total_points > 0);
    },
    initialData: [],
  });

  const { data: topByBirdies, isLoading: loadingBirdies } = useQuery({
    queryKey: ['leaderboard-birdies'],
    queryFn: async () => {
      const players = await base44.entities.Player.list("-total_birdies", 50);
      return players.filter(p => p.total_birdies > 0);
    },
    initialData: [],
  });

  const { data: topByHIOs, isLoading: loadingHIOs } = useQuery({
    queryKey: ['leaderboard-hios'],
    queryFn: async () => {
      const players = await base44.entities.Player.list("-total_hios", 50);
      return players.filter(p => p.total_hios > 0);
    },
    initialData: [],
  });

  const LeaderboardList = ({ players, valueKey, valueLabel, icon: Icon, loading }) => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      );
    }

    if (players.length === 0) {
      return (
        <div className="text-center py-12 text-slate-400">
          No players yet. Be the first!
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {players.map((player, index) => {
          const isTop3 = index < 3;
          const medals = [
            { color: "from-yellow-400 to-yellow-600", icon: Trophy },
            { color: "from-slate-300 to-slate-500", icon: Medal },
            { color: "from-orange-600 to-orange-800", icon: Award },
          ];

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl p-4 flex items-center gap-4 ${
                isTop3 
                  ? "bg-gradient-to-r from-slate-800 to-slate-700 border-2 border-lime-400/30" 
                  : "bg-slate-800/50 border border-slate-700/50"
              }`}
            >
              {/* Rank */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                isTop3 
                  ? `bg-gradient-to-br ${medals[index].color} text-white` 
                  : "bg-slate-700 text-slate-400"
              }`}>
                {isTop3 ? (
                  medals[index].icon === Trophy ? <Trophy className="w-6 h-6" /> :
                  medals[index].icon === Medal ? <Medal className="w-6 h-6" /> :
                  <Award className="w-6 h-6" />
                ) : (
                  `#${index + 1}`
                )}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className={`font-bold truncate ${isTop3 ? "text-lime-400 text-lg" : ""}`}>
                  {player.full_name}
                </div>
                <div className="text-sm text-slate-400">
                  {player.total_birdies || 0} birdies • {player.total_hios || 0} HIOs
                </div>
              </div>

              {/* Value */}
              <div className="flex-shrink-0 text-right">
                <div className={`font-black ${isTop3 ? "text-2xl text-lime-400" : "text-xl"}`}>
                  {player[valueKey]}
                </div>
                <div className="text-xs text-slate-400 flex items-center justify-end gap-1">
                  <Icon className="w-3 h-3" />
                  {valueLabel}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen px-6 py-12 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full p-4 mb-4">
            <Trophy className="w-12 h-12 text-slate-900" />
          </div>
          <h1 className="text-3xl font-black mb-2">Leaderboard</h1>
          <p className="text-slate-400">Top performers across all courses</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="points" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1 rounded-xl mb-6">
            <TabsTrigger 
              value="points"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lime-500 data-[state=active]:to-emerald-500 data-[state=active]:text-slate-900 rounded-lg"
            >
              Points
            </TabsTrigger>
            <TabsTrigger 
              value="birdies"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lime-500 data-[state=active]:to-emerald-500 data-[state=active]:text-slate-900 rounded-lg"
            >
              Birdies
            </TabsTrigger>
            <TabsTrigger 
              value="hios"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lime-500 data-[state=active]:to-emerald-500 data-[state=active]:text-slate-900 rounded-lg"
            >
              HIOs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="points">
            <LeaderboardList 
              players={topByPoints}
              valueKey="total_points"
              valueLabel="points"
              icon={Target}
              loading={loadingPoints}
            />
          </TabsContent>

          <TabsContent value="birdies">
            <LeaderboardList 
              players={topByBirdies}
              valueKey="total_birdies"
              valueLabel="birdies"
              icon={Target}
              loading={loadingBirdies}
            />
          </TabsContent>

          <TabsContent value="hios">
            <LeaderboardList 
              players={topByHIOs}
              valueKey="total_hios"
              valueLabel="HIOs"
              icon={Trophy}
              loading={loadingHIOs}
            />
          </TabsContent>
        </Tabs>

        {/* Qualification Info */}
        <div className="mt-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 text-center">
          <div className="text-2xl font-bold mb-2">💎 $1 MILLION SHOOTOUT</div>
          <p className="text-sm text-slate-300">
            Top point earners qualify for the annual championship tournament
          </p>
        </div>
      </motion.div>
    </div>
  );
}