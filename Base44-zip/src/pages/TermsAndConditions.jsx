import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course_id');
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 px-6 py-4">
      <div className="max-w-3xl mx-auto">
        {/* Logo */}
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69160cf2aef4d9ac26960600/3ad430bee_image.png" 
          alt="Par3 Challenge" 
          className="w-48 h-auto mx-auto mb-0 drop-shadow-2xl"
        />
        
        <h1 className="text-4xl font-black text-lime-400 mb-0 text-center -mt-2">Terms and Conditions</h1>
        <p className="text-slate-300 text-center mb-0">Par3 Challenge Official Rules and Regulations</p>
        <p className="text-sm text-slate-400 mt-0 mb-1 text-center">Last Updated: September 2025</p>

        {/* Content */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-6 text-white -mt-1">
          
          {/* Game Rules & Verification */}
          <section>
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              🏌️ Game Rules & Verification
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">One Shot Per Golfer Verification Policy</h3>
                <p className="text-slate-300">Each golfer is permitted one (1) official shot attempt per game session for prize verification purposes.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">AI Technology & Facial Recognition</h3>
                <p className="text-slate-300 mb-2">Par3 Challenge utilizes advanced artificial intelligence, facial recognition technology, and machine learning algorithms to:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                  <li>Verify player identity and prevent fraud</li>
                  <li>Analyze game performance and shot accuracy</li>
                  <li>Ensure fair play and legitimate prize claims</li>
                  <li>Enhance user experience through personalized features</li>
                </ul>
                <p className="text-slate-300 mt-2">By participating, you consent to the capture and processing of your biometric data for verification purposes.</p>
              </div>
            </div>
          </section>

          {/* Prize Claims & Anti-Fraud */}
          <section>
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              ⚖️ Prize Claims & Anti-Fraud Policy
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">🏌️ Amateur Golfers Only</h3>
                <p className="text-slate-300 mb-2">Par3 Challenge is exclusively for amateur status golfers. Participants must be 18+ years of age or have parental/guardian consent.</p>
                
                <p className="text-slate-300 font-semibold mb-2">EXCLUDED FROM PARTICIPATION:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                  <li>Par3 Challenge employees, contractors, and immediate family members</li>
                  <li>Golf course/club employees and their immediate family members</li>
                  <li>Tournament officials and event organizers</li>
                </ul>
                <p className="text-slate-400 text-sm mt-2">Note: Amateur status determination is at the sole discretion of Par3 Challenge management.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Verification Process</h3>
                <p className="text-slate-300 mb-2">All prize claims are subject to thorough verification including but not limited to:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                  <li>Video review and shot analysis</li>
                  <li>Identity verification through government-issued ID</li>
                  <li>Cross-reference with AI and facial recognition systems</li>
                  <li>Witness statements and facility records</li>
                  <li>Background checks for high-value prizes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tax Obligations */}
          <section>
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              💰 Tax Obligations & Reporting
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">IRS Reporting Requirements</h3>
                <p className="text-slate-300 mb-2">In accordance with IRS regulations:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                  <li>Prizes valued at $600 or more require mandatory reporting to state and federal tax authorities</li>
                  <li>Form 1099-MISC will be electronically filed and emailed to winners at their registered email address</li>
                  <li>Winners are responsible for all applicable federal, state, and local taxes</li>
                  <li>Tax withholding may be required for certain prize amounts</li>
                  <li>Social Security Number (SSN) or Tax Identification Number (TIN) required for prize claims over $600</li>
                </ul>
                <p className="text-yellow-400 text-sm mt-2">Important: Consult with a tax professional regarding your specific tax obligations. Par3 Challenge is not responsible for providing tax advice.</p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              📋 Intellectual Property & Copyright
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Protected Property</h3>
                <p className="text-slate-300 mb-2">The following are protected by copyright, trademark, and intellectual property laws:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                  <li>"Par3 Challenge" name and all variations</li>
                  <li>Par3 Challenge logo, designs, and branding materials</li>
                  <li>Game mechanics, processes, and unique gameplay concepts</li>
                  <li>Payment processing systems and software</li>
                  <li>Scoring algorithms and prize distribution methods</li>
                  <li>Mobile application and digital platform technologies</li>
                </ul>
                <p className="text-slate-400 text-sm mt-2">Copyright © 2025 Par3 Challenge, Devereaux Booth, et al.</p>
                <p className="text-slate-400 text-sm">All rights reserved. Unauthorized use, reproduction, or distribution is strictly prohibited and may result in legal action.</p>
              </div>
            </div>
          </section>

          {/* Additional Terms */}
          <section>
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              📜 Additional Terms & Conditions
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Not a Gambling Site</h3>
                <p className="text-slate-300">Par3 Challenge is NOT a gambling establishment. This is a skill-based golf challenge game where prizes are awarded based on athletic performance and golf skill. Participants pay for the golf experience and entertainment, with prizes awarded for achieving specific golf shots (hole-in-one, birdie, etc.). No element of chance determines the outcome - success is based entirely on golf skill and performance.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Prize Limitations</h3>
                <p className="text-slate-300">Prizes are non-transferable, non-refundable, and cannot be exchanged for cash except as required by law. Prize availability subject to change without notice.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Liability Waiver</h3>
                <p className="text-slate-300">Participants assume all risks associated with gameplay. Par3 Challenge, its officers, employees, and affiliates are not liable for injuries, damages, or losses incurred during participation.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Governing Law</h3>
                <p className="text-slate-300">These terms are governed by the laws of the state where the game is played. Any disputes will be resolved through binding arbitration.</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-lime-400 mb-4">Contact Information</h2>
            <p className="text-slate-300 mb-2">Par3 Challenge</p>
            <p className="text-slate-300">Email: devbooth1@yahoo.com</p>
            <p className="text-slate-400 text-sm mt-4">For questions regarding these terms, prize claims, or technical support, please contact us using the information above.</p>
          </section>

          {/* Acknowledgement */}
          <div className="border-t border-slate-600 pt-6">
            <p className="text-slate-300 text-center font-semibold">
              By participating in Par3 Challenge, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <Button
            onClick={() => navigate(createPageUrl("PlayerVerify") + `?course_id=${courseId}`)}
            className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-900 font-bold py-6 text-lg rounded-xl shadow-lg"
          >
            Accept & Continue to Game
          </Button>

          <Button
            onClick={() => navigate(createPageUrl("PlayerVerify") + `?course_id=${courseId}`)}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 py-6 text-lg rounded-xl flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}