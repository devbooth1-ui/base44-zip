import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Mail, Phone, Trophy, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdminPlayers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role !== 'admin') {
          toast.error("Access denied - Admin only");
          navigate(createPageUrl("Home"));
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        toast.error("Please log in");
        navigate(createPageUrl("Home"));
      }
    };
    checkAdmin();
  }, [navigate]);

  const { data: players, isLoading } = useQuery({
    queryKey: ['admin-players'],
    queryFn: () => base44.entities.Player.list('-created_date', 1000),
    initialData: []
  });

  const filteredPlayers = players.filter(player => 
    player.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: async (playerIds) => {
      for (const id of playerIds) {
        await base44.entities.Player.delete(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-players'] });
      setSelectedPlayers([]);
      toast.success("Player(s) deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete player(s)");
    }
  });

  const handleSelectPlayer = (playerId) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPlayers.length === filteredPlayers.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(filteredPlayers.map(p => p.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPlayers.length === 0) {
      toast.error("No players selected");
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedPlayers.length} player(s)?`)) {
      deleteMutation.mutate(selectedPlayers);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Players Management</h1>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search players by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="whitespace-nowrap"
            >
              {selectedPlayers.length === filteredPlayers.length && filteredPlayers.length > 0 ? "Deselect All" : "Select All"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={selectedPlayers.length === 0 || deleteMutation.isPending}
              className="whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedPlayers.length})
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-slate-900" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPlayers.map((player) => (
              <Card key={player.id} className={selectedPlayers.includes(player.id) ? "ring-2 ring-red-500" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedPlayers.includes(player.id)}
                        onCheckedChange={() => handleSelectPlayer(player.id)}
                      />
                      <span>{player.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {player.qualified_for_shootout && (
                        <span className="text-sm bg-yellow-400 text-slate-900 px-3 py-1 rounded-full font-bold">
                          $1M Qualified
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (confirm(`Delete ${player.full_name}?`)) {
                            deleteMutation.mutate([player.id]);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span>{player.email}</span>
                      </div>
                      {player.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span>{player.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{player.total_points || 0}</div>
                        <div className="text-xs text-slate-500">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                          <Target className="w-4 h-4" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{player.total_birdies || 0}</div>
                        <div className="text-xs text-slate-500">Birdies</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{player.total_hios || 0}</div>
                        <div className="text-xs text-slate-500">HIOs</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}