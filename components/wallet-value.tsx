'use client';

import React, { useEffect, useState } from 'react';
import { ethers, BrowserProvider } from 'ethers'; // Make sure you import ethers here correctly

interface WalletValueProps {
  connectedWallets: number;
}

export function WalletValue({ connectedWallets }: WalletValueProps) {
  const [account, setAccount] = useState<string | null>(null); // Store the MetaMask account
  const [walletBalance, setWalletBalance] = useState<number>(0); // Store wallet balance

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Create a provider from MetaMask's injected provider
          const provider = new BrowserProvider(window.ethereum);

          // Request user's MetaMask account
          const accounts = await provider.send('eth_requestAccounts', []);
          setAccount(accounts[0]);

          // Fetch wallet balance
          const balance = await provider.getBalance(accounts[0]);
          const balanceInEth = parseFloat(ethers.formatEther(balance)); // Corrected usage
          setWalletBalance(balanceInEth);
        } catch (error) {
          console.error('Error connecting to MetaMask or fetching data:', error);
        }
      } else {
        alert('MetaMask not detected!');
      }
    };

    connectWallet();
  }, []);

  if (!account) {
    return <div>Please connect your MetaMask wallet!</div>;
  }

  return (
    <div className="rounded-2xl bg-[#060709] p-6" id="myClasses">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Wallet Value</h3>
        <button className="text-gray-400 hover:text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="text-3xl font-bold mb-2">
        {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETH
      </div>

      <div className="flex items-center gap-2 text-sm text-blue-400">
        <span>{connectedWallets} WALLETS CONNECTED</span>
        <div className="flex -space-x-2">
          {Array.from({ length: connectedWallets }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-gray-700 border-2 border-[#14151f]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
