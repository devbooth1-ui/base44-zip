import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ClipboardCheck, CheckCircle, Clock, XCircle, AlertCircle, DollarSign, QrCode } from "lucide-react";

export default function ClaimsStatus() {
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('par3_current_player');
    if (stored) {
      setCurrentPlayer(JSON.parse(stored));
    }
  }, []);

  const { data: awards, isLoading } = useQuery({
    queryKey: ['player-awards', currentPlayer?.id],
    queryFn: () => base44.entities.Award.filter({ player_id: currentPlayer.id }, "-created_date"),
    initialData: [],
    enabled: !!currentPlayer
  });

  const statusConfig = {
    pending: { 
      icon: Clock, 
      color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30", 
      label: "Under Review",
      description: "Your claim is being reviewed by our team"
    },
    verified: { 
      icon: CheckCircle, 
      color: "text-blue-400 bg-blue-500/10 border-blue-500/30", 
      label: "Verified",
      description: "Video verified - Processing payout"
    },
    paid: { 
      icon: CheckCircle, 
      color: "text-green-400 bg-green-500/10 border-green-500/30", 
      label: "Paid Out",
      description: "Congratulations! Payment sent"
    },
    rejected: { 
      icon: XCircle, 
      color: "text-red-400 bg-red-500/10 border-red-500/30", 
      label: "Rejected",
      description: "Could not verify claim"
    },
  };

  if (!currentPlayer || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-lime-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="text-center">
          <div className="inline-block bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full p-3 mb-3">
            <ClipboardCheck className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-2xl font-black mb-1">Claims Status</h1>
          <p className="text-slate-400 text-sm">Track your prize claim verifications</p>
        </div>

        {awards.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No claims yet. Make a birdie or hole-in-one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {awards.map((award) => {
              const status = statusConfig[award.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const isBirdie = award.award_type === "birdie";
              const showQR = isBirdie && award.status === "verified" && award.qr_code_url;
              
              return (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-5 border ${status.color}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <StatusIcon className={`w-8 h-8 ${status.color.split(' ')[0]}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-lg text-white">
                            {award.award_type === "hole_in_one" ? "🏆 Hole-in-One" : "🎯 Birdie"}
                          </div>
                          <div className="text-xs text-slate-400">
                            {new Date(award.created_date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-lime-400 flex items-center gap-1">
                            <DollarSign className="w-5 h-5" />
                            {award.amount}
                          </div>
                        </div>
                      </div>

                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-3 ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </div>

                      <p className="text-sm text-slate-300 mb-3">
                        {status.description}
                      </p>

                      {/* QR Code Display for Verified Birdies */}
                      {showQR && (
                        <div className="bg-white rounded-lg p-4 mb-3 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <QrCode className="w-5 h-5 text-slate-700" />
                            <span className="font-bold text-slate-900">Your Redemption QR Code</span>
                          </div>
                          <img 
                            src={award.qr_code_url} 
                            alt="Redemption QR Code" 
                            className="w-48 h-48 mx-auto mb-2"
                          />
                          <p className="text-xs text-slate-600">
                            Present this at the pro shop to receive your $65 club card credit
                          </p>
                          {award.redemption_status === "redeemed" && (
                            <div className="mt-2 text-green-600 font-semibold text-sm">
                              ✓ Already Redeemed
                            </div>
                          )}
                        </div>
                      )}

                      {award.outfit_description && (
                        <div className="bg-slate-900/50 rounded-lg p-3 mb-2">
                          <div className="text-xs text-slate-500 mb-1">Your Details:</div>
                          <div className="text-sm text-slate-300">
                            <div><span className="text-slate-500">Outfit:</span> {award.outfit_description}</div>
                            <div><span className="text-slate-500">Tee Time:</span> {award.tee_time}</div>
                            {award.additional_info && (
                              <div><span className="text-slate-500">Notes:</span> {award.additional_info}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {award.admin_notes && (
                        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-3">
                          <div className="text-xs text-lime-400 mb-1 font-semibold">Admin Notes:</div>
                          <div className="text-sm text-slate-300">{award.admin_notes}</div>
                        </div>
                      )}

                      {award.status === 'paid' && award.payout_date && (
                        <div className="text-xs text-green-400 mt-2">
                          ✓ Paid on {new Date(award.payout_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-bold text-lime-400 mb-2 text-sm">Verification Timeline</h3>
          <div className="space-y-2 text-xs text-slate-400">
            <p>• Claims typically reviewed within 24-48 hours</p>
            <p>• Video footage reviewed for verification</p>
            <p>• Hole-in-One: Payment processed directly to you</p>
            <p>• Birdie: QR code sent for course redemption</p>
            <p>• You'll receive email notification at each stage</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}