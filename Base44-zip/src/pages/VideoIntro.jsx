import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function VideoIntro() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course_id');

  useEffect(() => {
    // Auto-navigate after 5 seconds (adjust based on actual video length)
    const timer = setTimeout(() => {
      navigate(createPageUrl("PreGame") + `?course_id=${courseId}`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, courseId]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onEnded={() => navigate(createPageUrl("PreGame") + `?course_id=${courseId}`)}
      >
        <source src="PLACEHOLDER_VIDEO_URL" type="video/mp4" />
      </video>
    </div>
  );
}