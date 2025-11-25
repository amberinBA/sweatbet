'use client';

import { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Loader2, Send, Users, Trophy, Lock, MessageSquare } from 'lucide-react';

/**
 * NOTE: XMTP integration temporarily disabled due to deprecated packages
 * @xmtp/react-sdk and @xmtp/xmtp-js are no longer supported
 * This is a simplified UI-only version. Future: integrate with Farcaster Frames messaging
 */

interface Message {
  id: string;
  content: string;
  senderAddress: string;
  timestamp: Date;
  isSystemMessage?: boolean;
}

interface XMTPGroupChatProps {
  groupName: string;
  participants: string[];
  betId: string;
  challenge: {
    name: string;
    description: string;
    targetDistance: number;
    deadline: Date;
    betAmount: string;
    activityType: string;
  };
  onBet: () => void;
  onProve: () => void;
  hasBet: boolean;
  hasProved: boolean;
  totalPool?: string;
}

export default function XMTPGroupChat({
  groupName,
  participants,
  betId,
  challenge,
  onBet,
  onProve,
  hasBet,
  hasProved,
  totalPool,
}: XMTPGroupChatProps) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading and add welcome messages
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          content: `💪 Welcome to ${groupName}!`,
          senderAddress: 'system',
          timestamp: new Date(),
          isSystemMessage: true,
        },
        {
          id: '2',
          content: `🎯 ${challenge.description}`,
          senderAddress: 'system',
          timestamp: new Date(),
          isSystemMessage: true,
        },
        {
          id: '3',
          content: `💡 Click "BET" to join, then complete your workout and "PROVE" it!`,
          senderAddress: 'system',
          timestamp: new Date(),
          isSystemMessage: true,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, [groupName, challenge]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addSystemMessage = (content: string) => {
    const msg: Message = {
      id: `system-${Date.now()}`,
      content,
      senderAddress: 'system',
      timestamp: new Date(),
      isSystemMessage: true,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleBetClick = () => {
    addSystemMessage(`🎲 Placing bet for ${challenge.betAmount} USDC...`);
    onBet();
    setTimeout(() => {
      addSystemMessage(`✅ Bet placed! Now go complete your workout!`);
    }, 2000);
  };

  const handleProveClick = () => {
    addSystemMessage(`🏃 Starting Strava proof flow...`);
    onProve();
  };

  const formatAddress = (addr: string) => {
    if (addr === 'system') return 'SweatBet';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-sweat-purple to-sweat-pink">
        <div className="text-center text-white">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-xl font-bold">Loading SweatBet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-sweat-purple to-sweat-pink">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              💪 {groupName}
            </h1>
            <p className="text-sm text-white/80 flex items-center gap-2">
              <Users size={14} />
              {participants.length || 1} participants
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">💰 {totalPool || challenge.betAmount} USDC</p>
            <p className="text-xs text-white/80">Total Pool</p>
          </div>
        </div>
      </div>

      {/* Challenge Info */}
      <div className="bg-white/10 backdrop-blur-lg p-4 mx-4 mt-4 rounded-xl border border-white/20">
        <div className="grid grid-cols-2 gap-4 text-white">
          <div>
            <p className="text-sm opacity-80">Target</p>
            <p className="font-bold">🎯 {(challenge.targetDistance / 1000).toFixed(1)} km</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Deadline</p>
            <p className="font-bold">📅 {challenge.deadline.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Bet Amount</p>
            <p className="font-bold">💵 {challenge.betAmount} USDC</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Activity</p>
            <p className="font-bold">🏃 {challenge.activityType}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${
              msg.isSystemMessage
                ? 'text-center'
                : msg.senderAddress === address
                ? 'text-right'
                : 'text-left'
            }`}
          >
            {msg.isSystemMessage ? (
              <div className="inline-block bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
                {msg.content}
              </div>
            ) : (
              <div
                className={`inline-block max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.senderAddress === address
                    ? 'bg-white text-sweat-purple'
                    : 'bg-white/20 backdrop-blur text-white'
                }`}
              >
                <p className="text-xs opacity-70 mb-1">{formatAddress(msg.senderAddress)}</p>
                <p>{msg.content}</p>
                <p className="text-xs opacity-50 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-2">
        {!hasBet && (
          <button
            onClick={handleBetClick}
            className="w-full bg-white text-sweat-purple font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-lg"
          >
            <Lock size={20} />
            BET {challenge.betAmount} USDC
          </button>
        )}

        {hasBet && !hasProved && (
          <button
            onClick={handleProveClick}
            className="w-full bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg"
          >
            <Trophy size={20} />
            PROVE WORKOUT
          </button>
        )}

        {hasProved && (
          <div className="bg-yellow-500/20 backdrop-blur border border-yellow-500/50 text-yellow-300 font-bold py-4 rounded-xl text-center">
            ✅ Proof Submitted - Waiting for deadline
          </div>
        )}
      </div>

      {/* Info Message */}
      <div className="bg-blue-500/20 backdrop-blur-lg p-3 mx-4 mb-4 rounded-xl border border-blue-500/50">
        <div className="flex items-start gap-2 text-white text-sm">
          <MessageSquare className="flex-shrink-0 mt-0.5" size={16} />
          <p className="opacity-90">
            <strong>Note:</strong> Full XMTP group chat coming soon! For now, use the bet and prove buttons above.
          </p>
        </div>
      </div>
    </div>
  );
}
