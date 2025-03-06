'use client'

import React, { useState, useEffect } from 'react';

interface SoulPoint {
  name: string;
  points: number;
  connected: boolean;
}

interface DashboardProfileProps {
  name: string
  walletId: string
  multiplier: number
  avatarUrl: string
}

export function DashboardProfile({ 
  name, 
  walletId, 
  multiplier, 
  avatarUrl 
}: DashboardProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [soulPoints, setSoulPoints] = useState<SoulPoint[]>([]);

  useEffect(() => {
    // Listen for soul points updates from the DashboardTabs component
    const handleSoulPointsUpdate = (event: CustomEvent<{ points: SoulPoint[] }>) => {
      setSoulPoints(event.detail.points);
    };

    window.addEventListener('soulPointsUpdate', handleSoulPointsUpdate as EventListener);

    return () => {
      window.removeEventListener('soulPointsUpdate', handleSoulPointsUpdate as EventListener);
    };
  }, []);

  const handleEditProfile = () => {
    if (isEditing) {
      // Save the changes
      // Here you would typically make an API call to update the profile
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const copyWalletId = async () => {
    try {
      await navigator.clipboard.writeText(walletId);
      // You could add a toast notification here
      alert('Wallet ID copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy wallet ID:', err);
    }
  };

  return (
    <div className="rounded-2xl bg-[#060709] p-6" id='myClasses'>
      <div className="flex items-start justify-between mb-6">
        <div className="relative">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
        </div>
        <button 
          className={`px-4 py-2 text-sm ${
            isEditing 
              ? 'bg-green-500/20 text-green-500' 
              : 'bg-[#1c1d29] hover:bg-[#2a2b3d]'
          } rounded-lg transition-colors`}
          onClick={handleEditProfile}
        >
          {isEditing ? 'Save profile' : 'Edit profile'}
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-2xl font-bold bg-[#1c1d29] rounded px-2 py-1 w-full"
            />
          ) : (
            <h2 className="text-2xl font-bold">{editedName}</h2>
          )}
          <p className="text-gray-400 flex items-center gap-2">
            {walletId}
            <button 
              className="hover:text-gray-300"
              onClick={copyWalletId}
              title="Copy wallet ID"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Soul Points</span>
            <div className="flex items-center gap-2 text-blue-400">
              <span>Multiplier</span>
              <span className="font-bold">{multiplier}x</span>
            </div>
          </div>

          <div className="space-y-2">
            {soulPoints.filter(point => point.connected).map((point) => (
              <div 
                key={point.name}
                className="flex items-center justify-between p-2 rounded bg-[#1c1d29]"
              >
                <span className="text-white">{point.name}</span>
                <span className="font-medium text-green-500">+{point.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
  
  