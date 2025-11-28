import React, { useEffect } from "react";

export default function Confetti() {
  useEffect(() => {
    const colors = ['#10b981', '#84cc16', '#fbbf24', '#f59e0b', '#ef4444'];
    const confettiCount = 80;
    const confettiElements = [];

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      document.body.appendChild(confetti);
      confettiElements.push(confetti);
    }

    return () => {
      confettiElements.forEach(el => el.remove());
    };
  }, []);

  return (
    <style>{`
      .confetti-piece {
        position: fixed;
        width: 10px;
        height: 10px;
        top: -10px;
        z-index: 9999;
        animation: confetti-fall linear forwards;
      }
      
      @keyframes confetti-fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `}</style>
  );
}