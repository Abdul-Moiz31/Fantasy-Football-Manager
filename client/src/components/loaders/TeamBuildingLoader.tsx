import { Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FootballLoader } from '@/components/ui/FootballLoader';

export function TeamBuildingLoader() {
  const steps = [
    { label: "Selecting 3 Goalkeepers", completed: true },
    { label: "Choosing 6 Defenders", completed: true },
    { label: "Picking 6 Midfielders", completed: true },
    { label: "Finalizing 5 Forwards & $5M budget", active: true }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2E7D32] to-[#43A047]">
      <Card className="w-full max-w-lg text-center shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#2E7D32] to-[#43A047] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-[#424242] mb-2">Building Your Squad</CardTitle>
          <p className="text-[#424242]/70 text-lg">Creating your dream team with 20 unique players</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="mb-8">
            <FootballLoader size={64} />
          </div>
          
          <div className="mb-8 text-[#424242] text-base">
            We're assembling your dream team with the perfect formation. This will only take a moment.
          </div>
          
          {/* Progress Steps */}
          <div className="space-y-4 text-left">
            {steps.map((step, index) => (
              <div key={index} className={`flex items-center gap-4 p-3 rounded-lg border ${
                step.completed ? 'bg-green-50 border-green-200' : 
                step.active ? 'bg-blue-50 border-blue-200 animate-pulse' : 'bg-gray-50 border-gray-200'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-[#43A047] flex-shrink-0" />
                ) : step.active ? (
                  <FootballLoader size={20} />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span className="text-sm font-medium text-[#424242]">{step.label}</span>
              </div>
            ))}
          </div>
          
          {/* Team Stats Preview */}
          <div className="mt-8 p-4 bg-gradient-to-r from-[#2E7D32]/10 to-[#43A047]/10 rounded-lg border border-[#43A047]/20">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#2E7D32]">20</div>
                <div className="text-xs text-[#424242]/70">Players</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2E7D32]">$5M</div>
                <div className="text-xs text-[#424242]/70">Budget</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#2E7D32] to-[#43A047] h-2 rounded-full animate-pulse" style={{width: '75%'}} />
            </div>
            <div className="text-xs text-[#424242]/60 mt-2">Creating your unique squad...</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 