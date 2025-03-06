'use client'

import { useState, useEffect } from 'react'

interface SolidScoreProps {
    score: number
    maxScore: number
    increase: number
  }
  
  interface SoulPoint {
    name: string;
    points: number;
    connected: boolean;
  }
  
  export function SolidScore({ score, maxScore, increase }: SolidScoreProps) {
    const [showInfo, setShowInfo] = useState(false)
    const [currentScore, setCurrentScore] = useState(0)
    const maxPossibleScore = 310 // Total possible points from all connections
  
    useEffect(() => {
      // Listen for soul points updates
      const handleSoulPointsUpdate = (event: CustomEvent<{ points: SoulPoint[] }>) => {
        const totalPoints = event.detail.points.reduce((total, point) => 
          total + (point.connected ? point.points : 0), 0
        );
  
        // Animate the score change
        let current = currentScore;
        const animate = () => {
          if (current < totalPoints) {
            current += 1;
            setCurrentScore(current);
            requestAnimationFrame(animate);
          } else if (current > totalPoints) {
            current -= 1;
            setCurrentScore(current);
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      };
  
      window.addEventListener('soulPointsUpdate', handleSoulPointsUpdate as EventListener);
  
      return () => {
        window.removeEventListener('soulPointsUpdate', handleSoulPointsUpdate as EventListener);
      };
    }, [currentScore]);
  
    const percentage = (currentScore / maxPossibleScore) * 100;
  
    return (
      <div className="rounded-2xl bg-[#060709] p-6" id='myClasses'>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Soul Score</h3>
          <button 
            className="text-gray-400 hover:text-gray-300"
            onClick={() => setShowInfo(!showInfo)}
            title="Show information about Soul Score"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        
        {showInfo && (
          <div className="mb-4 p-3 bg-[#1c1d29] rounded-lg text-sm text-gray-300">
            Your Soul Score represents your overall reputation and trustworthiness in the ecosystem. 
            Connect services to increase your score up to a maximum of {maxPossibleScore} points.
          </div>
        )}
  
        <div className="flex items-end gap-4 mb-4">
          <div className="text-5xl font-bold text-[#22c55e]">{currentScore}</div>
          <div className="text-sm text-gray-400 mb-2">/{maxPossibleScore}</div>
        </div>
        
        <div className="relative h-2 bg-[#1c1d29] rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-[#22c55e] transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
  
  