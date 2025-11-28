import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { UserCircle, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export default function PlayerVerify() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course_id');

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: ""
  });
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const createPlayerMutation = useMutation({
    mutationFn: async (data) => {
      const existing = await base44.entities.Player.filter({ email: data.email });
      if (existing.length > 0) {
        return { player: existing[0], isNew: false };
      }
      const newPlayer = await base44.entities.Player.create(data);
      return { player: newPlayer, isNew: true };
    },
    onSuccess: ({ player, isNew }) => {
      localStorage.setItem('par3_current_player', JSON.stringify(player));
      toast.success(`Welcome ${player.full_name}!`);
      
      if (isNew) {
        navigate(createPageUrl("AwardsInfo") + `?course_id=${courseId}`);
      } else {
        navigate(createPageUrl("Wallet"));
      }
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!agreedToTerms) {
      toast.error("You must agree to the terms and conditions to continue");
      return;
    }
    createPlayerMutation.mutate(formData);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/191bce2ef_image.png')"
        }}
      />
      <div className="fixed inset-0 bg-white/10" />

      {/* Logo */}
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/3ad430bee_image.png" 
        alt="Par3 Challenge" 
        className="absolute left-1/2 -translate-x-1/2 w-36 h-auto drop-shadow-2xl z-10"
        style={{ top: 80 }}
      />

      {/* Title */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-white text-center drop-shadow-lg z-10" style={{ top: 230 }}>
        Let's get you checked in
      </h1>

      {/* Form */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 280 }}>
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-2.5 space-y-1.5 shadow-xl">
          <div>
            <Label htmlFor="full_name" className="text-green-900 font-semibold mb-0.5 flex items-center gap-1 text-[11px]">
              <UserCircle className="w-3 h-3" />
              Full Name *
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="John Smith"
              className="bg-white/30 border-white/40 text-slate-900 placeholder:text-slate-600 text-sm h-9"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-green-900 font-semibold mb-0.5 flex items-center gap-1 text-[11px]">
              <Mail className="w-3 h-3" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com"
              className="bg-white/30 border-white/40 text-slate-900 placeholder:text-slate-600 text-sm h-9"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-green-900 font-semibold mb-0.5 flex items-center gap-1 text-[11px]">
              <Phone className="w-3 h-3" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="(555) 123-4567"
              className="bg-white/30 border-white/40 text-slate-900 placeholder:text-slate-600 text-sm h-9"
            />
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 480 }}>
        <div className="bg-black/40 backdrop-blur-md border border-white/30 rounded-2xl p-2 shadow-xl">
          <div className="flex items-start gap-2">
            <Checkbox 
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
              className="mt-0.5 bg-white/30 border-white/40 data-[state=checked]:bg-green-600"
            />
            <Label 
              htmlFor="terms" 
              className="text-white text-[10px] leading-tight cursor-pointer"
            >
              I agree to the{" "}
              <button
                type="button"
                onClick={() => navigate(createPageUrl("TermsAndConditions") + `?course_id=${courseId}`)}
                className="text-lime-400 font-bold underline"
              >
                terms and conditions
              </button>
              {" "}including AI shot verification and recording.
            </Label>
          </div>
        </div>
      </div>

      {/* Approach Shot Button */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 550 }}>
        <Button
          onClick={handleSubmit}
          disabled={createPlayerMutation.isPending || !agreedToTerms}
          className="w-full bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3.5 text-base rounded-xl shadow-lg disabled:opacity-50"
        >
          {createPlayerMutation.isPending ? "Setting Up..." : "Approach Shot"}
        </Button>
      </div>

      {/* Back Button */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10" style={{ top: 610 }}>
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(createPageUrl("Home"))}
          className="w-full text-white hover:text-white/80 text-xs py-1"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}