'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useWriteContract } from 'wagmi';
import { findQualifyingActivity, generateZKProof, getRecentActivities } from '@/lib/vlayer-prover';
import { BETTING_ESCROW_ABI, getContractAddresses } from '@/lib/contracts';
import { Loader2, CheckCircle2, XCircle, Trophy } from 'lucide-react';

function ProveContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { writeContract } = useWriteContract();
  
  const [status, setStatus] = useState<'loading' | 'selecting' | 'generating' | 'success' | 'error'>('loading');
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [error, setError] = useState('');
  
  const betId = searchParams.get('betId');
  const token = searchParams.get('token');
  
  useEffect(() => {
    async function loadActivities() {
      if (!token) return;
      
      try {
        const recentActivities = await getRecentActivities(
          token,
          new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // Last 14 days
        );
        
        // Filter qualifying activities (5km+)
        const qualifying = recentActivities.filter(
          (activity) => activity.distance >= 5000
        );
        
        setActivities(qualifying);
        setStatus('selecting');
      } catch (err) {
        console.error('Error loading activities:', err);
        setError('Failed to load Strava activities');
        setStatus('error');
      }
    }
    
    loadActivities();
  }, [token]);
  
  const handleSelectActivity = async (activity: any) => {
    setSelectedActivity(activity);
    setStatus('generating');
    
    try {
      // Generate ZK proof
      const zkProof = await generateZKProof(token!, activity.id);
      
      // Submit to smart contract
      const contracts = getContractAddresses(44787); // Alfajores
      
      await writeContract({
        address: contracts.escrow,
        abi: BETTING_ESCROW_ABI,
        functionName: 'submitZKProof',
        args: [
          BigInt(betId!),
          zkProof.proof as `0x${string}`,
          BigInt(Math.floor(zkProof.claim.distance)),
        ],
      });
      
      setStatus('success');
      
      // Redirect back after 3 seconds
      setTimeout(() => {
        router.push(`/?betId=${betId}`);
      }, 3000);
    } catch (err) {
      console.error('Error generating proof:', err);
      setError('Failed to generate or submit proof');
      setStatus('error');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sweat-purple to-sweat-pink p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-4">🏃 Prove Your Workout</h1>
          
          {status === 'loading' && (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto mb-4" size={48} />
              <p>Loading your Strava activities...</p>
            </div>
          )}
          
          {status === 'selecting' && (
            <div>
              <p className="mb-4">Select a qualifying activity (5km+ distance):</p>
              {activities.length === 0 ? (
                <div className="text-center py-8 bg-red-500/20 rounded-xl">
                  <XCircle className="mx-auto mb-2" size={48} />
                  <p className="font-bold">No qualifying activities found</p>
                  <p className="text-sm mt-2">You need a 5km+ run or ride in the last 14 days</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => handleSelectActivity(activity)}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl p-4 text-left transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold">{activity.name}</div>
                        <div className="text-sm bg-white/20 px-2 py-1 rounded">
                          {activity.type}
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span>📏 {(activity.distance / 1000).toFixed(2)} km</span>
                        <span>⏱️ {Math.floor(activity.moving_time / 60)} min</span>
                        <span>📅 {new Date(activity.start_date).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {status === 'generating' && (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto mb-4" size={48} />
              <p className="font-bold mb-2">Generating ZK Proof...</p>
              <p className="text-sm opacity-80">
                This may take a minute. We're proving your workout without revealing GPS data.
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center py-12">
              <Trophy className="mx-auto mb-4 text-yellow-300" size={64} />
              <p className="text-2xl font-bold mb-2">Proof Submitted! 🎉</p>
              <p className="mb-4">
                You proved {(selectedActivity?.distance / 1000).toFixed(2)} km
              </p>
              <CheckCircle2 className="mx-auto text-green-400" size={48} />
              <p className="text-sm mt-4 opacity-80">Redirecting back to chat...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center py-12">
              <XCircle className="mx-auto mb-4 text-red-400" size={64} />
              <p className="text-xl font-bold mb-2">Something went wrong</p>
              <p className="text-sm opacity-80 mb-4">{error}</p>
              <button
                onClick={() => router.push(`/?betId=${betId}`)}
                className="bg-white text-sweat-purple px-6 py-2 rounded-xl font-bold"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProvePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sweat-purple to-sweat-pink">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    }>
      <ProveContent />
    </Suspense>
  );
}
