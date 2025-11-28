import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { QrCode, DollarSign, CheckCircle, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";

export default function CoursePaymentDashboard() {
  const queryClient = useQueryClient();
  const [qrInput, setQrInput] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);

  // For now, we'll use a simple course selection or assume logged-in course staff
  // In production, this would be authenticated per course
  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.list(),
  });

  // Get all birdie awards for the selected course
  const { data: birdiePayments = [] } = useQuery({
    queryKey: ['course-birdie-payments', currentCourse?.id],
    queryFn: () => base44.entities.Award.filter({ 
      course_id: currentCourse.id,
      award_type: "birdie",
      course_payment_status: "paid"
    }, "-created_date"),
    enabled: !!currentCourse,
    initialData: []
  });

  // Mutation to redeem a QR code
  const redeemMutation = useMutation({
    mutationFn: async (awardId) => {
      // TODO: This should call a backend function to verify and update
      // For now, we'll update directly (requires backend function in production)
      await base44.entities.Award.update(awardId, {
        redemption_status: "redeemed"
      });
      
      return awardId;
    },
    onSuccess: () => {
      toast.success("Award redeemed successfully!");
      setQrInput("");
      setLookupResult(null);
      queryClient.invalidateQueries(['award-lookup']);
    },
    onError: () => {
      toast.error("Failed to redeem award");
    }
  });

  const handleLookup = async () => {
    if (!qrInput.trim()) {
      toast.error("Please enter an award ID");
      return;
    }

    try {
      const awards = await base44.entities.Award.filter({ 
        id: qrInput.trim(),
        award_type: "birdie",
        status: "verified"
      });

      if (awards.length === 0) {
        toast.error("Award not found or not verified");
        setLookupResult(null);
        return;
      }

      const award = awards[0];
      
      if (award.course_id !== currentCourse?.id) {
        toast.error("This award is for a different course");
        setLookupResult(null);
        return;
      }

      if (award.redemption_status === "redeemed") {
        toast.error("This award has already been redeemed");
      }

      setLookupResult(award);
    } catch (error) {
      toast.error("Error looking up award");
      setLookupResult(null);
    }
  };

  const handleRedeem = () => {
    if (lookupResult) {
      redeemMutation.mutate(lookupResult.id);
    }
  };

  const totalPayments = birdiePayments.reduce((sum, award) => sum + (award.amount || 0), 0);

  return (
    <div className="min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full p-4 mb-4">
            <QrCode className="w-12 h-12 text-slate-900" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Course Payment Dashboard</h1>
          <p className="text-slate-400">Scan QR codes and track birdie payouts</p>
        </div>

        {/* Course Selection */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
          <h2 className="text-lime-400 font-bold mb-3">Select Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setCurrentCourse(course)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  currentCourse?.id === course.id
                    ? "border-lime-500 bg-lime-500/10"
                    : "border-slate-600 bg-slate-900/50 hover:border-slate-500"
                }`}
              >
                <div className="font-bold text-white">{course.course_name}</div>
                <div className="text-sm text-slate-400">Hole #{course.hole_number}</div>
              </button>
            ))}
          </div>
        </div>

        {currentCourse && (
          <>
            {/* Payment Summary */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
              <h2 className="text-lime-400 font-bold mb-4">Payment Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                  <Sparkles className="w-8 h-8 text-lime-400 mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">{birdiePayments.length}</div>
                  <div className="text-sm text-slate-400">Total Birdies</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">${totalPayments}</div>
                  <div className="text-sm text-slate-400">Total Received</div>
                </div>
              </div>
            </div>

            {/* QR Code Scanner/Input */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
              <h2 className="text-lime-400 font-bold mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Scan QR Code
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                Enter the award ID from the player's QR code:
              </p>
              
              <div className="flex gap-3 mb-4">
                <Input
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                  placeholder="Enter Award ID"
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
                <Button
                  onClick={handleLookup}
                  className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-bold"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Look Up
                </Button>
              </div>

              {/* Lookup Result */}
              {lookupResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-white text-lg">{lookupResult.player_name}</div>
                      <div className="text-slate-300 text-sm">{lookupResult.player_email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-lime-400">${lookupResult.amount}</div>
                      <div className="text-xs text-slate-400">Birdie Award</div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-300 mb-3">
                    <div><span className="text-slate-400">Outfit:</span> {lookupResult.outfit_description}</div>
                    <div><span className="text-slate-400">Tee Time:</span> {lookupResult.tee_time}</div>
                    <div><span className="text-slate-400">Date:</span> {new Date(lookupResult.created_date).toLocaleDateString()}</div>
                  </div>

                  {lookupResult.redemption_status === "redeemed" ? (
                    <div className="bg-green-600/20 border border-green-500 rounded-lg p-3 text-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
                      <div className="text-green-400 font-bold">Already Redeemed</div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleRedeem}
                      disabled={redeemMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {redeemMutation.isPending ? "Processing..." : "Confirm Redemption"}
                    </Button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Recent Payments */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-lime-400 font-bold mb-4">Recent Payments</h2>
              {birdiePayments.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No payments yet</p>
              ) : (
                <div className="space-y-2">
                  {birdiePayments.slice(0, 10).map((award) => (
                    <div
                      key={award.id}
                      className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-white">{award.player_name}</div>
                        <div className="text-xs text-slate-400">
                          {new Date(award.created_date).toLocaleDateString()} • {award.tee_time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lime-400">${award.amount}</div>
                        {award.redemption_status === "redeemed" && (
                          <div className="text-xs text-green-400">✓ Redeemed</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Backend Integration Note */}
        <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="text-yellow-400 font-bold mb-2">⚠️ Backend Functions Required</div>
          <div className="text-sm text-slate-300">
            <p className="mb-2">Full birdie payout automation requires backend functions to be enabled:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Automatic Stripe payout to course when admin verifies birdie</li>
              <li>QR code generation and storage</li>
              <li>Email/SMS notifications to players with QR codes</li>
              <li>Secure redemption endpoint for course dashboard</li>
            </ul>
            <p className="mt-2 text-xs">
              Enable backend functions in Dashboard → Settings to activate full automation.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}