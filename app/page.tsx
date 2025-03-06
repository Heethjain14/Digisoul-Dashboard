import { DashboardProfile } from '@/components/dashboard-profile'
import { DashboardTabs } from '@/components/dasboard-tabs'
import { SolidScore } from '@/components/solid-score'
import { WalletValue } from '@/components/wallet-value'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <DashboardProfile 
            name="UnknownUser"
            walletId="0xCa...6C25"
            multiplier={2.4}
            avatarUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8Cb4HKucjsHbzMaVe7XbGiNqLIRyji.png"
          />
          <div className="space-y-6">
            <SolidScore score={360} maxScore={800} increase={32} />
            <WalletValue connectedWallets={3} />
          </div>
        </div>
        <DashboardTabs />
      </div>
    </main>
  )
}
