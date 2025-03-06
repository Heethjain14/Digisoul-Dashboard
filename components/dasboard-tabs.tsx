'use client'

import { useState, useEffect } from 'react'

interface SocialConnection {
  id: string
  name: string
  icon: string
  description: string
  connected: boolean
  soulPoints: number
  url: string
}

const TABS = [
  { id: 'credit', label: 'Credit' },
  { id: 'social', label: 'Social' },
  { id: 'professional', label: 'Professional' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'on-chain', label: 'On-chain Activities' },
  { id: 'legal', label: 'Legal Identity' },
]

const INITIAL_SOCIAL_CONNECTIONS: SocialConnection[] = [
  {
    id: 'sibilScore',
    name: 'Sibil Score',
    icon: '📊',
    description: 'Connect your Sibil Score to boost your reputation.',
    connected: false,
    soulPoints: 150,
    url: 'https://sibil.example.com/connect'
  },
  {
    id: 'mAdhar',
    name: 'mAdhar',
    icon: '🆔',
    description: 'Verify your identity with mAdhar.',
    connected: false,
    soulPoints: 100,
    url: 'https://madhar.example.com/verify'
  },
  {
    id: 'google',
    name: 'Google',
    icon: 'G',
    description: 'Connect to Google to verify your email address.',
    connected: false,
    soulPoints: 30,
    url: 'https://accounts.google.com/oauth'
  },
  {
    id: 'x',
    name: 'X',
    icon: '𝕏',
    description: 'Connect to X to verify your social media presence.',
    connected: false,
    soulPoints: 30,
    url: 'https://x.com/oauth'
  },
]

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('social')
  const [connections, setConnections] = useState<SocialConnection[]>(INITIAL_SOCIAL_CONNECTIONS)

  // Emit soul points information whenever connections change
  useEffect(() => {
    const soulPointsInfo = connections.map(conn => ({
      name: conn.name,
      points: conn.soulPoints,
      connected: conn.connected
    }));

    window.dispatchEvent(new CustomEvent('soulPointsUpdate', { 
      detail: { points: soulPointsInfo }
    }));
  }, [connections]);

  const handleConnection = async (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId)
    if (!connection) return

    if (connection.connected) {
      // Handle disconnection
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId ? { ...conn, connected: false } : conn
      ))
      return
    }

    // Open connection URL in a new window
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const connectionWindow = window.open(
      connection.url,
      `Connect ${connection.name}`,
      `width=${width},height=${height},left=${left},top=${top}`
    )

    // Simulate connection process
    setTimeout(() => {
      if (connectionWindow) {
        connectionWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Connecting to ${connection.name}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  background: #0a0b14;
                  color: white;
                }
                .loader {
                  border: 4px solid #1c1d29;
                  border-top: 4px solid #22c55e;
                  border-radius: 50%;
                  width: 50px;
                  height: 50px;
                  animation: spin 1s linear infinite;
                  margin-bottom: 20px;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .success {
                  color: #22c55e;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="loader"></div>
              <p>Connecting to ${connection.name}...</p>
            </body>
          </html>
        `)

        // After 2 seconds, show success message
        setTimeout(() => {
          connectionWindow.document.body.innerHTML = `
            <div class="success">
              <h2>✓ Connected Successfully!</h2>
              <p>You've earned ${connection.soulPoints} Soul Points</p>
              <p>This window will close automatically...</p>
            </div>
          `

          // Update connection state
          setConnections(prev => prev.map(conn => 
            conn.id === connectionId ? { ...conn, connected: true } : conn
          ))

          // Close window after showing success
          setTimeout(() => connectionWindow.close(), 2000)
        }, 2000)
      }
    }, 100)
  }

  return (
    <div className="rounded-2xl bg-[#060709] p-6">
      <div className="flex gap-2 overflow-x-auto pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {connections.map((connection) => (
          <div id="myClasses" 
            key={connection.id}
            className="p-4 rounded-xl bg-[#1c1d29] flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#14151f] flex items-center justify-center text-xl">
                {connection.icon}
              </div>
              <div>
                <h4 className="font-medium">{connection.name}</h4>
                <p className="text-sm text-gray-400">{connection.description}</p>
                <p className="text-sm text-yellow-500">+{connection.soulPoints} Soul Points</p>
              </div>
            </div>
            <button
              onClick={() => handleConnection(connection.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                connection.connected
                  ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {connection.connected ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

