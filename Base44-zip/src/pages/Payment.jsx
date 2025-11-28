import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CreditCard, Loader2, Video, Check, Circle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Payment() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course_id');

  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const courses = await base44.entities.Course.filter({ id: courseId });
      return courses[0];
    },
    enabled: !!courseId
  });

  const { data: player } = useQuery({
    queryKey: ['player', currentPlayer?.id],
    queryFn: async () => {
      const players = await base44.entities.Player.filter({ id: currentPlayer.id });
      return players[0];
    },
    enabled: !!currentPlayer
  });

  useEffect(() => {
    const stored = localStorage.getItem('par3_current_player');
    if (stored) {
      setCurrentPlayer(JSON.parse(stored));
    } else {
      navigate(createPageUrl("PlayerVerify") + `?course_id=${courseId}`);
    }
  }, [courseId, navigate]);

  const createPlayMutation = useMutation({
    mutationFn: async ({ paymentMethod, shouldSave }) => {
      const play = await base44.entities.Play.create({
        player_id: currentPlayer.id,
        player_name: currentPlayer.full_name,
        player_email: currentPlayer.email,
        course_id: course.id,
        course_name: course.course_name,
        hole_number: course.hole_number,
        entry_fee: course.entry_fee,
        payment_status: "paid",
        play_date: new Date().toISOString()
      });

      if (shouldSave && paymentMethod && !player.saved_payment_methods?.find(m => m.type === paymentMethod)) {
        const savedMethods = player.saved_payment_methods || [];
        savedMethods.push({
          type: paymentMethod,
          last_four: "****",
          is_default: savedMethods.length === 0
        });
        await base44.entities.Player.update(currentPlayer.id, {
          saved_payment_methods: savedMethods
        });
      }

      return play;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['player-plays']);
      queryClient.invalidateQueries(['player']);
      toast.success("Payment successful! Time to play!");
      navigate(createPageUrl("PreGame") + `?course_id=${courseId}`);
    },
    onError: () => {
      toast.error("Failed to create play. Please try again.");
    }
  });

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
  };

  const handleSwingAway = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method first");
      return;
    }
    const isAlreadySaved = savedMethods.find(m => m.type === selectedMethod);
    createPlayMutation.mutate({ 
      paymentMethod: selectedMethod, 
      shouldSave: !isAlreadySaved && savePaymentMethod 
    });
  };

  if (!course || !currentPlayer || !player) {
    return null;
  }

  const savedMethods = player?.saved_payment_methods || [];
  const paymentOptions = [
    { type: "PayPal", icon: "https://cdn-icons-png.flaticon.com/512/174/174861.png" },
    { type: "Card", icon: <CreditCard className="w-4 h-4 mr-2" /> },
    { type: "Apple Pay", icon: "https://cdn-icons-png.flaticon.com/512/731/731985.png" },
    { type: "Google Pay", icon: "https://cdn-icons-png.flaticon.com/512/281/281764.png" }
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1920&q=80')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      <div className="relative w-full h-full px-4">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/3ad430bee_image.png" 
          alt="Par3 Challenge" 
          className="w-40 h-auto drop-shadow-2xl mx-auto absolute left-1/2 -translate-x-1/2"
          style={{ top: '100px' }}
        />
        
        <h1 
          className="text-xl font-black text-white tracking-tight drop-shadow-lg text-center absolute left-1/2 -translate-x-1/2 w-full"
          style={{ top: '220px' }}
        >
          READY<span className="text-yellow-400">.</span>SET<span className="text-lime-400">.</span>GOLF<span className="text-emerald-400">.</span>
        </h1>

        <div 
          className="bg-white/15 backdrop-blur-xl border border-white/40 rounded-2xl p-3 text-center shadow-xl absolute left-1/2 -translate-x-1/2 w-full max-w-md"
          style={{ top: '270px' }}
        >
          <div className="text-white/90 text-sm mb-1 font-semibold">Entry Fee</div>
          <div className="text-3xl font-black text-lime-400 drop-shadow-lg">${course.entry_fee.toFixed(2)}</div>
        </div>

        <div 
          className="max-h-[35vh] overflow-y-auto space-y-2 absolute left-1/2 -translate-x-1/2 w-full max-w-md"
          style={{ top: '370px' }}
        >
            {savedMethods.length > 0 && (
                  <>
                    <div className="text-sm text-lime-400 font-black text-center mb-2 drop-shadow-lg">
                      SAVED METHODS
                    </div>
                    <div className="space-y-2 mb-3">
                      {savedMethods.map((method, idx) => (
                        <Button
                          key={idx}
                          onClick={() => handleSelectMethod(method.type)}
                          disabled={createPlayMutation.isPending}
                          className={`w-full backdrop-blur-md border text-white font-bold py-3 text-base rounded-xl transition-all flex items-center justify-between shadow-lg ${
                            selectedMethod === method.type 
                              ? 'bg-lime-500/30 border-lime-400' 
                              : 'bg-white/20 hover:bg-white/30 border-white/50'
                          }`}
                        >
                          <div className="flex items-center">
                            {selectedMethod === method.type ? (
                              <Check className="w-4 h-4 mr-2 text-lime-400" />
                            ) : (
                              <Circle className="w-4 h-4 mr-2 text-white/50" />
                            )}
                            <span>{method.type} {method.last_four}</span>
                          </div>
                          {method.is_default && <span className="text-xs text-lime-400">Default</span>}
                        </Button>
                      ))}
                    </div>
                    <div className="text-sm text-white/80 font-bold text-center mb-2">
                      OR ADD NEW
                    </div>
                  </>
                )}

                <div className="space-y-2 mb-3">
                  {paymentOptions.filter(opt => !savedMethods.find(m => m.type === opt.type)).map((option) => (
                    <Button
                      key={option.type}
                      onClick={() => handleSelectMethod(option.type)}
                      disabled={createPlayMutation.isPending}
                      className={`w-full backdrop-blur-md border text-white font-bold py-3 text-base rounded-xl transition-all shadow-lg ${
                        selectedMethod === option.type 
                          ? 'bg-lime-500/30 border-lime-400' 
                          : 'bg-white/20 hover:bg-white/30 border-white/50'
                      }`}
                    >
                      {selectedMethod === option.type ? (
                        <Check className="w-4 h-4 mr-2 text-lime-400" />
                      ) : (
                        <Circle className="w-4 h-4 mr-2 text-white/50" />
                      )}
                      {typeof option.icon === 'string' ? (
                        <img src={option.icon} className="w-3.5 h-3.5 mr-2" alt={option.type} />
                      ) : (
                        option.icon
                      )}
                      {option.type}
                    </Button>
                  ))}
                </div>

                {/* Save for future checkbox - only show for new methods */}
                {selectedMethod && !savedMethods.find(m => m.type === selectedMethod) && (
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
                    <Checkbox
                      id="savePayment"
                      checked={savePaymentMethod}
                      onCheckedChange={setSavePaymentMethod}
                      className="border-white/50 data-[state=checked]:bg-lime-500"
                    />
                    <label htmlFor="savePayment" className="text-white text-sm cursor-pointer">
                      Save this payment method for future use
                    </label>
                  </div>
                )}
              </div>

        <div
          className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4"
          style={{ bottom: '100px' }}
        >
          <Button
            onClick={handleSwingAway}
            disabled={createPlayMutation.isPending || !selectedMethod}
            className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-900 font-black py-4 text-lg rounded-xl shadow-2xl disabled:opacity-50"
          >
            {createPlayMutation.isPending ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Processing...
              </>
            ) : (
              "Swing Away"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}