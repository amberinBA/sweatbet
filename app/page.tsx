'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccount, useWriteContract, useReadContract, useConnect, useWaitForTransactionReceipt } from 'wagmi';
import { resolveUsernames } from '@/lib/neynar';
import { getStravaAuthUrl } from '@/lib/vlayer-prover';
import { BETTING_ESCROW_ABI, ERC20_ABI, getContractAddresses, parseCUSD, formatCUSD } from '@/lib/contracts';
import { Loader2 } from 'lucide-react';
import XMTPGroupChat from '@/components/XMTPGroupChat';

function SweatBetApp() {
  const searchParams = useSearchParams();
  const { address, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { writeContract, data: hash, isPending: isWritePending } = useWriteContract();

  const [usernames, setUsernames] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [betId, setBetId] = useState<string>('1'); // Default to bet ID 1
  const [isLoading, setIsLoading] = useState(true);
  const [hasBet, setHasBet] = useState(false);
  const [hasProved, setHasProved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

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

  // Check if user has already bet and proved
  const { data: userHasProof } = useReadContract({
    address: contracts?.escrow,
    abi: BETTING_ESCROW_ABI,
    functionName: 'hasProof',
    args: betId && address ? [BigInt(betId), address] : undefined,
  });

  useEffect(() => {
    if (userHasProof) {
      setHasProved(true);
    }
  }, [userHasProof]);

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

  // Check if user has already bet by looking at bet participants
  useEffect(() => {
    if (betDetails && address) {
      const [, , , participants] = betDetails;
      const userHasBet = participants.some(
        (p: string) => p.toLowerCase() === address.toLowerCase()
      );
      setHasBet(userHasBet);
    }
  }, [betDetails, address]);

  const handleBet = async () => {
    if (!contracts || !address) {
      alert('Please connect wallet first');
      return;
    }

    try {
      setIsApproving(true);

      // Step 1: Approve USDC
      const approveHash = await writeContract({
        address: contracts.cUSD,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [contracts.escrow, parseCUSD(challenge.betAmount)],
      });

      console.log('Approve tx hash:', approveHash);

      // Wait for approval
      await new Promise(resolve => setTimeout(resolve, 5000));

      setIsApproving(false);

      // Step 2: Place bet
      const betHash = await writeContract({
        address: contracts.escrow,
        abi: BETTING_ESCROW_ABI,
        functionName: 'placeBet',
        args: [BigInt(betId)],
      });

      console.log('Place bet tx hash:', betHash);

      // Wait for confirmation
      await new Promise(resolve => setTimeout(resolve, 5000));

      setHasBet(true);
      alert('🎉 Bet placed successfully!');
    } catch (error: any) {
      console.error('Failed to place bet:', error);
      alert(`Failed to place bet: ${error.message || 'Unknown error'}`);
      setIsApproving(false);
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
          <p className="text-xl font-bold">
            {!address ? 'Connecting wallet...' : 'Loading SweatBet...'}
          </p>
        </div>
      </div>
    );
  }

  const totalPool = betDetails
    ? formatCUSD(betDetails[4] as bigint)
    : challenge.betAmount;

  // Use XMTP Group Chat as main UI
  return (
    <XMTPGroupChat
      groupName={challenge.name}
      participants={addresses.length > 0 ? addresses : (betDetails ? (betDetails[3] as string[]) : [])}
      betId={betId}
      challenge={challenge}
      onBet={handleBet}
      onProve={handleProve}
      hasBet={hasBet}
      hasProved={hasProved}
      totalPool={totalPool}
    />
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