'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccount, useWriteContract, useReadContract, useConnect } from 'wagmi';
import { resolveUsernames } from '@/lib/neynar';
import { getStravaAuthUrl } from '@/lib/vlayer-prover';
import { BETTING_ESCROW_ABI, ERC20_ABI, getContractAddresses, parseCUSD, formatCUSD } from '@/lib/contracts';
import { Loader2 } from 'lucide-react';

function SweatBetApp() {
  const searchParams = useSearchParams();
  const { address, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { writeContract } = useWriteContract();
  
  const [usernames, setUsernames] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [betId, setBetId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasBet, setHasBet] = useState(false);
  const [hasProved, setHasProved] = useState(false);
  
  const challenge = {
    name: 'SweatBet Squad',
    description: 'Bet 1 USDC — Run/Ride 5 km by Sunday or lose your money',
    targetDistance: 5000,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    betAmount: '1',
    activityType: 'Run',
  };
  
  const contracts = chainId ? getContractAddresses(chainId) : null;
  
  const { data: betDetails } = useReadContract({
    address: contracts?.escrow,
    abi: BETTING_ESCROW_ABI,
    functionName: 'getBetDetails',
    args: betId ? [BigInt(betId)] : undefined,
  });
  
  useEffect(() => {
  }, []);
  
  useEffect(() => {
    async function init() {
      const usernamesParam = searchParams.get('usernames');
      const betIdParam = searchParams.get('betId');
      
      if (betIdParam) {
        setBetId(betIdParam);
      }
      
      if (usernamesParam) {
        const names = usernamesParam.split(',');
        setUsernames(names);
        
        try {
          const addressMap = await resolveUsernames(names);
          const resolvedAddresses = Array.from(addressMap.values());
          setAddresses(resolvedAddresses);
        } catch (error) {
          console.error('Failed to resolve usernames:', error);
        }
      }
      
      setIsLoading(false);
    }
    
    init();
  }, [searchParams]);
  
  useEffect(() => {
    if (!address && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [address, connectors, connect]);
  
  const handleBet = async () => {
    if (!contracts || !address) return;
    
    try {
      await writeContract({
        address: contracts.cUSD,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [contracts.escrow, parseCUSD(challenge.betAmount)],
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await writeContract({
        address: contracts.escrow,
        abi: BETTING_ESCROW_ABI,
        functionName: 'placeBet',
        args: [BigInt(betId)],
      });
      
      setHasBet(true);
    } catch (error) {
      console.error('Failed to place bet:', error);
    }
  };
  
  const handleProve = () => {
    const authUrl = getStravaAuthUrl(betId);
    window.location.href = authUrl;
  };
  
  if (isLoading || !address) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sweat-purple to-sweat-pink">
        <div className="text-center text-white">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-xl font-bold">Loading SweatBet...</p>
        </div>
      </div>
    );
  }
  
  // CHANGED THIS PART - removed XMTPGroupChat
  return (
    <div className="min-h-screen bg-gradient-to-br from-sweat-purple to-sweat-pink p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-4">💪 SweatBet</h1>
          <p className="mb-4">Group betting on Strava workouts with ZK proofs</p>
          
          <div className="bg-white/20 rounded-xl p-4 mb-4">
            <h2 className="font-bold mb-2">Challenge Details</h2>
            <p>🎯 Target: {(challenge.targetDistance / 1000).toFixed(1)} km</p>
            <p>💰 Bet Amount: {challenge.betAmount} USDC</p>
            <p>📅 Deadline: {challenge.deadline.toLocaleDateString()}</p>
          </div>

          <div className="bg-white/20 rounded-xl p-4 mb-4">
            <h2 className="font-bold mb-2">Participants</h2>
            <p>{usernames.join(', ') || 'No participants yet'}</p>
          </div>

          {!hasBet && (
            <button
              onClick={handleBet}
              className="w-full bg-white text-sweat-purple font-bold py-4 rounded-xl mb-2"
            >
              💰 BET {challenge.betAmount} USDC
            </button>
          )}

          {hasBet && (
            <button
              onClick={handleProve}
              className="w-full bg-green-500 text-white font-bold py-4 rounded-xl"
            >
              🏃 PROVE WORKOUT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sweat-purple to-sweat-pink">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    }>
      <SweatBetApp />
    </Suspense>
  );
}