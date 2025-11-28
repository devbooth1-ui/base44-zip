import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Trophy, DollarSign, Sparkles, CheckCircle2, Clock, Mail } from "lucide-react";
import { toast } from "sonner";

export default function Awards() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const playId = urlParams.get('play_id');
  const result = urlParams.get('result');
  const courseId = urlParams.get('course_id');

  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [claimData, setClaimData] = useState({
    outfit_description: "",
    tee_time: "",
    additional_info: ""
  });

  const { data: play } = useQuery({
    queryKey: ['play', playId],
    queryFn: async () => {
      const plays = await base44.entities.Play.filter({ id: playId });
      return plays[0];
    },
    enabled: !!playId
  });

  useEffect(() => {
    const stored = localStorage.getItem('par3_current_player');
    if (stored) {
      setCurrentPlayer(JSON.parse(stored));
    }
  }, []);

  const createAwardMutation = useMutation({
    mutationFn: async (data) => {
      const award = await base44.entities.Award.create(data);
      
      // Send notification emails (don't block on this)
      base44.integrations.Core.SendEmail({
        to: "devbooth1@yahoo.com",
        subject: `NEW ${result === "hole_in_one" ? "HOLE-IN-ONE" : "BIRDIE"} CLAIM - Verification Required`,
        body: `A new ${result === "hole_in_one" ? "hole-in-one" : "birdie"} claim requires verification:\n\nPlayer: ${data.player_name}\nEmail: ${data.player_email}\nAmount: $${data.amount}\nOutfit: ${data.outfit_description}\nTee Time: ${data.tee_time}\nAdditional Info: ${data.additional_info}\n\nPlease review camera footage to verify this claim.`
      }).catch(err => console.log("Email 1 failed", err));
      
      base44.integrations.Core.SendEmail({
        to: "hlindenau@live.com",
        subject: `NEW ${result === "hole_in_one" ? "HOLE-IN-ONE" : "BIRDIE"} CLAIM - Verification Required`,
        body: `A new ${result === "hole_in_one" ? "hole-in-one" : "birdie"} claim requires verification:\n\nPlayer: ${data.player_name}\nEmail: ${data.player_email}\nAmount: $${data.amount}\nOutfit: ${data.outfit_description}\nTee Time: ${data.tee_time}\nAdditional Info: ${data.additional_info}\n\nPlease review camera footage to verify this claim.`
      }).catch(err => console.log("Email 2 failed", err));
      
      return award;
    },
    onSuccess: () => {
      setShowSuccess(true);
    },
    onError: (error) => {
      toast.error("Failed to submit claim. Please try again.");
    }
  });

  const handleClaimSubmit = async () => {
    if (!claimData.outfit_description || !claimData.tee_time) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!playId || !currentPlayer) {
      toast.error("Missing required data");
      return;
    }

    try {
      await createAwardMutation.mutateAsync({
        play_id: playId,
        player_id: currentPlayer.id,
        player_name: currentPlayer.full_name,
        player_email: currentPlayer.email,
        course_id: courseId,
        award_type: result,
        amount: result === "hole_in_one" ? 1000 : 65,
        points: result === "hole_in_one" ? 100 : 50,
        outfit_description: claimData.outfit_description,
        tee_time: claimData.tee_time,
        additional_info: claimData.additional_info,
        status: "pending"
      });
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  if (!play || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-lime-400" />
      </div>
    );
  }

  const isHIO = result === "hole_in_one";
  const prizeAmount = isHIO ? 1000 : 65;

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-4 mb-3">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-black text-lime-400 mb-1">
              Claim Submitted!
            </h1>
            <p className="text-slate-300 text-sm">
              Your {isHIO ? "hole-in-one" : "birdie"} is being verified
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h2 className="text-lime-400 font-bold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              What Happens Next
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center text-slate-900 font-bold text-xs">
                  1
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Video Review</div>
                  <div className="text-slate-400 text-xs">Our team reviews the camera footage ({isHIO ? "up to 24 hours" : "24-48 hours"})</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-xs">
                  2
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Verification Complete</div>
                  <div className="text-slate-400 text-xs">
                    {isHIO 
                      ? "You'll receive an email with next steps"
                      : "You'll receive a QR code via email and text"
                    }
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-xs">
                  3
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {isHIO ? "Payment Processed" : "Redeem at Course"}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {isHIO 
                      ? "Prize sent via your original payment method (debit card/bank), or through Venmo, PayPal, Zelle, or check if needed."
                      : "Present your QR code at the pro shop to receive your $65 club card credit."
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-3 text-center">
            <Mail className="w-5 h-5 text-lime-400 mx-auto mb-1" />
            <p className="text-slate-300 text-xs">
              Check your email at <span className="text-lime-400 font-semibold">{currentPlayer.email}</span> for updates
            </p>
          </div>

          <Button
            onClick={() => navigate(createPageUrl("ClaimsStatus"))}
            className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-900 font-bold py-3 text-sm rounded-lg"
          >
            View My Claims
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Home"))}
            className="w-full text-slate-400 text-xs"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3 mb-2">
            {isHIO ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-black text-white mb-1">
            {isHIO ? "HOLE-IN-ONE!!!" : "BIRDIE!!!"}
          </h1>
          <p className="text-slate-300 text-sm">
            Congratulations {currentPlayer.full_name}!
          </p>
          <div className="text-3xl font-black text-lime-400 mt-2">
            ${prizeAmount}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <div className="text-sm text-lime-400 font-semibold mb-2">
            📹 VERIFICATION REQUIRED
          </div>
          <p className="text-sm text-slate-400 mb-3">
            Provide details to verify your play:
          </p>

          <div className="space-y-3">
            <div>
              <Label htmlFor="outfit" className="text-slate-300 text-sm">
                Outfit *
              </Label>
              <Input
                id="outfit"
                value={claimData.outfit_description}
                onChange={(e) => setClaimData({...claimData, outfit_description: e.target.value})}
                placeholder="Blue polo, khaki pants"
                className="bg-slate-900/50 border-slate-600 text-white text-sm"
              />
            </div>

            <div>
              <Label htmlFor="tee_time" className="text-slate-300 text-sm">
                Tee time *
              </Label>
              <Input
                id="tee_time"
                value={claimData.tee_time}
                onChange={(e) => setClaimData({...claimData, tee_time: e.target.value})}
                placeholder="2:30 PM"
                className="bg-slate-900/50 border-slate-600 text-white text-sm"
              />
            </div>

            <div>
              <Label htmlFor="additional" className="text-slate-300 text-sm">
                Additional info
              </Label>
              <Textarea
                id="additional"
                value={claimData.additional_info}
                onChange={(e) => setClaimData({...claimData, additional_info: e.target.value})}
                placeholder="Playing with a group, etc."
                className="bg-slate-900/50 border-slate-600 text-white text-sm min-h-20 resize-none"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleClaimSubmit}
          disabled={createAwardMutation.isPending}
          className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-900 font-bold py-4 text-base rounded-lg"
        >
          {createAwardMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-slate-900 mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <DollarSign className="w-5 h-5 mr-2" />
              Claim ${prizeAmount}
            </>
          )}
        </Button>

        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-3 text-sm text-slate-300">
          <div className="font-semibold text-lime-400 mb-1">💰 Payout</div>
          <ul className="space-y-1 text-sm">
            <li>• Reviewed within {isHIO ? "24 hours" : "24-48 hours"}</li>
            <li>• Video verification for fairness</li>
            {isHIO ? (
              <li>• Via debit/bank, Venmo, PayPal, Zelle, or check</li>
            ) : (
              <li>• QR code sent for course redemption</li>
            )}
          </ul>
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Home"))}
          className="w-full text-slate-400 text-sm"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}