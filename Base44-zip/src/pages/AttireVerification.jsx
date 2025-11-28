import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import Confetti from "../components/Confetti";

export default function AttireVerification() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const playId = urlParams.get('play_id');

  const [formData, setFormData] = useState({
    outfit_description: "",
    tee_time: "",
    date: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('par3_current_player');
    if (stored) {
      setCurrentPlayer(JSON.parse(stored));
    }
  }, []);

  const { data: play, isLoading: playLoading } = useQuery({
    queryKey: ['play', playId],
    queryFn: async () => {
      const plays = await base44.entities.Play.filter({ id: playId });
      return plays[0];
    },
    enabled: !!playId
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.outfit_description || !formData.date || !formData.tee_time) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!playId || !play) {
      toast.error("Play data not found. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the play record
      await base44.entities.Play.update(playId, {
        verification_status: "pending"
      });

      // Send email notification
      await base44.integrations.Core.SendEmail({
        to: "par3challenge@gmail.com",
        subject: `New Verification Submission - ${play.result}`,
        body: `
          Player: ${play.player_name}
          Result: ${play.result}
          Outfit: ${formData.outfit_description}
          Date: ${formData.date}
          Tee Time: ${formData.tee_time}
          
          Please review in the admin panel.
        `
      });

      toast.success("Verification submitted successfully!");
      navigate(createPageUrl("Scorecard"));
      
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (playLoading || !play || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-lime-400" />
      </div>
    );
  }

  const prizeInfo = play.result === "hole_in_one" 
    ? { amount: "$1,000", points: 800, title: "Hole-in-One" }
    : { amount: "$65 Club Card", points: 200, title: "Birdie" };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/3bb95df6a_golf-bg.jpg')"
        }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <Confetti />
      
      <div className="relative h-full overflow-y-auto px-4 py-8 pb-12">
        <div className="w-full max-w-md mx-auto min-h-full flex items-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden w-full">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-6 text-center">
              <h1 className="text-2xl font-black text-white mb-2">
                Congratulations {currentPlayer?.full_name?.split(' ')[0] || 'Player'}!
              </h1>
              <p className="text-lg font-bold text-white mb-2">
                on your {prizeInfo.title}!
              </p>
              <p className="text-base font-bold text-white">
                You've claimed: <span className="text-green-200">{prizeInfo.amount} + {prizeInfo.points} Points</span>
              </p>
            </div>

            <div className="p-4">
              <p className="text-center text-gray-700 text-sm mb-4">
                Let's get some details for recognition and verification.
              </p>

              <div className="space-y-3">
                <div>
                  <label htmlFor="outfit" className="text-sm font-bold text-gray-800 mb-2 block">
                    Outfit Description for Verification
                  </label>
                  <Textarea
                    id="outfit"
                    value={formData.outfit_description}
                    onChange={(e) => setFormData({...formData, outfit_description: e.target.value})}
                    placeholder="Please describe what you were wearing (e.g., blue cap, red polo, white pants)"
                    className="border-2 border-green-500 focus:border-green-600 min-h-[70px] text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="text-sm font-bold text-gray-800 mb-2 block">
                    Date of Achievement
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="border-2 border-green-500 focus:border-green-600 text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="tee_time" className="text-sm font-bold text-gray-800 mb-2 block">
                    Approximate Tee Time
                  </label>
                  <Input
                    id="tee_time"
                    type="time"
                    value={formData.tee_time}
                    onChange={(e) => setFormData({...formData, tee_time: e.target.value})}
                    className="border-2 border-green-500 focus:border-green-600 text-gray-700"
                  />
                </div>

                <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 text-center">
                  Awards subject to verification. Confirmation status will be emailed within
                  <span className="font-bold"> {play.result === "birdie" ? "1 hour" : "24 hours"}</span>.
                </div>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-base rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Verification"
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock className="w-3 h-3" />
                  <span>Your information is secure and used only for prize verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}