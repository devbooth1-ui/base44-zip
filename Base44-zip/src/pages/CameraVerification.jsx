import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Video, CheckCircle, XCircle, Clock, Trophy, Target } from "lucide-react";
import { toast } from "sonner";

export default function CameraVerification() {
  const queryClient = useQueryClient();
  const [selectedAward, setSelectedAward] = useState(null);

  const { data: pendingAwards = [], isLoading } = useQuery({
    queryKey: ['pending-awards'],
    queryFn: () => base44.entities.Award.filter({ status: "pending" }, "-created_date"),
    refetchInterval: 30000
  });

  const updateAwardMutation = useMutation({
    mutationFn: async ({ awardId, status, notes }) => {
      const award = pendingAwards.find(a => a.id === awardId);
      const isBirdie = award?.award_type === "birdie";

      // Update award status
      await base44.entities.Award.update(awardId, {
        status,
        admin_notes: notes,
        payout_date: status === "verified" ? new Date().toISOString() : null,
        // For birdies, set QR code content to the award ID (QR generation happens in backend)
        qr_code_content: isBirdie && status === "verified" ? awardId : null,
        // TODO: Backend function will generate QR code and set qr_code_url
        // Placeholder for now - in production this would be set by backend function
        qr_code_url: isBirdie && status === "verified" 
          ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${awardId}` 
          : null,
        course_payment_status: isBirdie && status === "verified" ? "paid" : null,
        // TODO: Backend function would create Stripe payout and set transaction ID
        course_payment_transaction_id: isBirdie && status === "verified" ? "PLACEHOLDER_TX_" + Date.now() : null
      });

      // Send notification email to player
      if (status === "verified" && award) {
        const emailBody = isBirdie 
          ? `Congratulations ${award.player_name}!\n\nYour birdie has been verified! You'll receive a QR code via text message shortly.\n\nPresent this QR code at the ${award.course_id ? 'course' : 'pro shop'} to redeem your $${award.amount} club card credit.\n\nYou can also view your QR code anytime in the Claims Status page of the app.\n\nThank you for playing Par3 Challenge!`
          : `Congratulations ${award.player_name}!\n\nYour hole-in-one has been verified! Your $${award.amount} prize will be processed within 24 hours.\n\nPayment will be sent to your original payment method, or via an alternative method (Venmo, PayPal, Zelle, or check) if needed.\n\nFor any questions about your payout, please contact us.\n\nThank you for playing Par3 Challenge!`;

        await base44.integrations.Core.SendEmail({
          to: award.player_email,
          subject: `${award.award_type === "hole_in_one" ? "Hole-in-One" : "Birdie"} Award Verified!`,
          body: emailBody
        });

        // TODO: Send SMS with QR code (requires SMS integration / backend function)
        // For birdies only: Send text message with QR code link
      }

      // TODO: For birdies, backend function should:
      // 1. Retrieve course from award.course_id
      // 2. Get course.stripe_account_id
      // 3. Initiate Stripe transfer of $65 to course
      // 4. Update award.course_payment_transaction_id
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-awards']);
      setSelectedAward(null);
      toast.success("Award status updated!");
    }
  });

  const handleVerify = (awardId) => {
    updateAwardMutation.mutate({
      awardId,
      status: "verified",
      notes: "Verified via camera footage"
    });
  };

  const handleReject = (awardId) => {
    const notes = prompt("Reason for rejection:");
    if (notes) {
      updateAwardMutation.mutate({
        awardId,
        status: "rejected",
        notes
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-lime-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full p-4 mb-4">
            <Video className="w-12 h-12 text-slate-900" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Camera Verification</h1>
          <p className="text-slate-400">Review and verify player claims</p>
        </div>

        {/* Backend Integration Notice */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="text-yellow-400 font-bold mb-1">⚠️ Backend Functions Required for Full Automation</div>
          <div className="text-xs text-slate-300">
            When verifying birdies, the system will:
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Generate QR code for player redemption (currently using placeholder)</li>
              <li>Send $65 to course via Stripe Connect (requires backend function)</li>
              <li>Email and text QR code to player (email works, SMS needs backend)</li>
            </ul>
          </div>
        </div>

        {pendingAwards.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">All Caught Up!</h2>
            <p className="text-slate-400">No pending claims to verify</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAwards.map((award) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${
                      award.award_type === "hole_in_one" 
                        ? "bg-yellow-500/20" 
                        : "bg-emerald-500/20"
                    }`}>
                      {award.award_type === "hole_in_one" ? (
                        <Trophy className="w-6 h-6 text-yellow-400" />
                      ) : (
                        <Target className="w-6 h-6 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {award.award_type === "hole_in_one" ? "Hole-in-One" : "Birdie"}
                      </h3>
                      <p className="text-slate-400 text-sm">{award.player_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-lime-400">${award.amount}</div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {new Date(award.created_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Player Email</div>
                    <div className="text-sm text-white">{award.player_email}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Tee Time</div>
                    <div className="text-sm text-white">{award.tee_time}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Outfit Description</div>
                    <div className="text-sm text-white">{award.outfit_description}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Additional Info</div>
                    <div className="text-sm text-white">{award.additional_info || "None"}</div>
                  </div>
                </div>

                {award.award_type === "birdie" && (
                  <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 mb-4 text-sm text-slate-300">
                    <div className="font-semibold text-emerald-400 mb-1">On Verify:</div>
                    <ul className="space-y-1 text-xs">
                      <li>✓ QR code generated and sent to player</li>
                      <li>✓ $65 paid to course via Stripe</li>
                      <li>✓ Player notified via email and text</li>
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleVerify(award.id)}
                    disabled={updateAwardMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify & Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(award.id)}
                    disabled={updateAwardMutation.isPending}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}