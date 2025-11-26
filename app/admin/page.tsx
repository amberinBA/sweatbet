'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BETTING_ESCROW_ABI, getContractAddresses, parseCUSD } from '@/lib/contracts';
import { Loader2, CheckCircle } from 'lucide-react';

export default function AdminPage() {
  const { address, chainId } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [betAmount, setBetAmount] = useState('1');
  const [targetDistance, setTargetDistance] = useState('5000');
  const [daysUntilDeadline, setDaysUntilDeadline] = useState('7');
  const [activityType, setActivityType] = useState('Run');

  const contracts = chainId ? getContractAddresses(chainId) : null;

  const handleCreateBet = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contracts || !address) {
      alert('Please connect wallet first');
      return;
    }

    try {
      const deadline = Math.floor(Date.now() / 1000) + (parseInt(daysUntilDeadline) * 24 * 60 * 60);

      await writeContract({
        address: contracts.escrow,
        abi: BETTING_ESCROW_ABI,
        functionName: 'createBet',
        args: [
          parseCUSD(betAmount),
          BigInt(targetDistance),
          BigInt(deadline),
          activityType,
        ],
      });
    } catch (error: any) {
      console.error('Failed to create bet:', error);
      alert(`Failed to create bet: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sweat-purple to-sweat-pink p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">🔧 Admin: Create Bet</h1>
          <p className="text-sm opacity-80 mb-6">
            Create a new bet challenge. You must be the contract owner.
          </p>

          {!address ? (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 text-center">
              <p>⚠️ Please connect your wallet first</p>
            </div>
          ) : (
            <form onSubmit={handleCreateBet} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Bet Amount (USDC)</label>
                <input
                  type="number"
                  step="0.01"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full bg-white/20 backdrop-blur text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="1.0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Target Distance (meters)</label>
                <input
                  type="number"
                  value={targetDistance}
                  onChange={(e) => setTargetDistance(e.target.value)}
                  className="w-full bg-white/20 backdrop-blur text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="5000"
                  required
                />
                <p className="text-xs opacity-70 mt-1">
                  {(parseInt(targetDistance) / 1000).toFixed(1)} km
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Days Until Deadline</label>
                <input
                  type="number"
                  value={daysUntilDeadline}
                  onChange={(e) => setDaysUntilDeadline(e.target.value)}
                  className="w-full bg-white/20 backdrop-blur text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="7"
                  required
                />
                <p className="text-xs opacity-70 mt-1">
                  Deadline: {new Date(Date.now() + parseInt(daysUntilDeadline) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Activity Type</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full bg-white/20 backdrop-blur text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                >
                  <option value="Run">Run</option>
                  <option value="Ride">Ride</option>
                  <option value="Swim">Swim</option>
                  <option value="Hike">Hike</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="w-full bg-white text-sweat-purple font-bold py-4 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {isPending ? 'Confirm in wallet...' : 'Creating bet...'}
                  </>
                ) : (
                  '🚀 Create Bet'
                )}
              </button>

              {isSuccess && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center">
                  <CheckCircle className="mx-auto mb-2" size={48} />
                  <p className="font-bold">✅ Bet Created Successfully!</p>
                  <p className="text-sm mt-2">Transaction: {hash}</p>
                  <a
                    href={`https://explorer.celo.org/alfajores/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline mt-2 inline-block"
                  >
                    View on Explorer
                  </a>
                </div>
              )}
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/20">
            <h2 className="font-bold mb-2">📝 Instructions</h2>
            <ol className="text-sm opacity-90 space-y-1 list-decimal list-inside">
              <li>Connect your wallet (must be contract owner)</li>
              <li>Fill in bet parameters above</li>
              <li>Click "Create Bet" and confirm transaction</li>
              <li>Wait for confirmation</li>
              <li>Note the bet ID from the transaction</li>
              <li>Share: https://sweatbet-sigma.vercel.app/?betId=BETID</li>
            </ol>
          </div>

          <div className="mt-4 bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
            <p className="text-sm">
              <strong>Contract:</strong> {contracts?.escrow || 'Connect wallet to see'}
            </p>
            <p className="text-sm mt-1">
              <strong>Network:</strong> Celo Sepolia (Chain ID: 44787)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
