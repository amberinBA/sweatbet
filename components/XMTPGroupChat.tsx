'use client';

import { useEffect, useState, useRef } from 'react';
import { XMTPProvider, useClient, useConversations, useStartConversation, useMessages, useSendMessage } from '@xmtp/react-sdk';
import { useAccount } from 'wagmi';
import { Loader2, Send, DollarSign, CheckCircle2, Users, Trophy, Clock } from 'lucide-react';

interface GroupChatProps {
  betId: string;
  usernames: string[];
  addresses: string[];
  challenge: {
    name: string;
    description: string;
    targetDistance: number;
    deadline: Date;
    betAmount: string;
    activityType: string;
  };
  onBetClick: () => void;
  onProveClick: () => void;
  participants: string[];
  hasBet: boolean;
  hasProved: boolean;
  totalPool: string;
}

export default function XMTPGroupChat({
  betId,
  usernames,
  addresses,
  challenge,
  onBetClick,
  onProveClick,
  participants,
  hasBet,
  hasProved,
  totalPool,
}: GroupChatProps) {
  return (
    <XMTPProvider>
      <GroupChatInner
        betId={betId}
        usernames={usernames}
        addresses={addresses}
        challenge={challenge}
        onBetClick={onBetClick}
        onProveClick={onProveClick}
        participants={participants}
        hasBet={hasBet}
        hasProved={hasProved}
        totalPool={totalPool}
      />
    </XMTPProvider>
  );
}

function GroupChatInner(props: GroupChatProps) {
  const { address } = useAccount();
  const { client, initialize } = useClient();
  const { conversations } = useConversations();
  const { startConversation } = useStartConversation();
  
  const [groupConversation, setGroupConversation] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize XMTP client
  useEffect(() => {
    async function init() {
      if (!address) return;
      
      try {
        await initialize({ signer: undefined });
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize XMTP:', error);
        setIsInitializing(false);
      }
    }
    
    init();
  }, [address, initialize]);

  // Create or join group conversation
  useEffect(() => {
    async function setupGroup() {
      if (!client || conversations.length === 0) return;
      
      // Check if group already exists
      const existingGroup = conversations.find(
        (conv: any) => conv.topic.includes(props.betId)
      );
      
      if (existingGroup) {
        setGroupConversation(existingGroup);
        return;
      }
      
      // Create new group
      try {
        const group = await startConversation({
          peerAddresses: props.addresses.filter(addr => addr !== address),
          conversationId: `sweatbet-${props.betId}`,
          metadata: {
            conversationTitle: props.challenge.name,
            description: props.challenge.description,
          },
        });
        
        setGroupConversation(group);
      } catch (error) {
        console.error('Failed to create group:', error);
      }
    }
    
    setupGroup();
  }, [client, conversations, props.betId, props.addresses, address, startConversation, props.challenge]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-sweat-purple to-sweat-pink">
      {/* Challenge Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4 border-b border-white/20">
        <h1 className="text-2xl font-bold text-white mb-2">
          💪 {props.challenge.name}
        </h1>
        <p className="text-white/80 text-sm mb-3">{props.challenge.description}</p>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xs text-white/70">Target</div>
            <div className="font-bold text-white">
              {(props.challenge.targetDistance / 1000).toFixed(1)} km
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xs text-white/70">Pool</div>
            <div className="font-bold text-white">💰 {props.totalPool} cUSD</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xs text-white/70">Deadline</div>
            <div className="font-bold text-white text-xs">
              {new Date(props.challenge.deadline).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="bg-white/5 backdrop-blur p-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-white text-sm">
          <Users size={16} />
          <span className="font-semibold">{props.participants.length} Participants:</span>
          <span className="text-white/70">{props.usernames.join(', ')}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-2">
        {!props.hasBet && (
          <button
            onClick={props.onBetClick}
            className="w-full bg-white text-sweat-purple font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <DollarSign size={24} />
            BET {props.challenge.betAmount} cUSD
          </button>
        )}
        
        {props.hasBet && !props.hasProved && new Date() >= props.challenge.deadline && (
          <button
            onClick={props.onProveClick}
            className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={24} />
            PROVE WORKOUT 🏃
          </button>
        )}
        
        {props.hasProved && (
          <div className="w-full bg-green-500/20 border-2 border-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
            <Trophy size={24} />
            Proof Submitted! 🎉
          </div>
        )}
      </div>

      {/* Messages */}
      {groupConversation ? (
        <MessageList 
          conversation={groupConversation}
          messagesEndRef={messagesEndRef}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <Loader2 className="animate-spin mx-auto mb-2" size={32} />
            <p>Setting up group chat...</p>
          </div>
        </div>
      )}

      {/* Message Input */}
      {groupConversation && (
        <MessageInput
          conversation={groupConversation}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
        />
      )}
    </div>
  );
}

function MessageList({ conversation, messagesEndRef }: any) {
  const { messages } = useMessages(conversation);
  const { address } = useAccount();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message: any, i: number) => {
        const isMe = message.senderAddress === address;
        const content = message.content;
        
        // Parse commands
        const isBetCommand = content === '!bet';
        const isProveCommand = content === '!prove';
        
        return (
          <div
            key={i}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                isMe
                  ? 'bg-white text-sweat-purple'
                  : 'bg-white/20 backdrop-blur text-white'
              }`}
            >
              {!isMe && (
                <div className="text-xs opacity-70 mb-1">
                  {message.senderAddress.slice(0, 6)}...{message.senderAddress.slice(-4)}
                </div>
              )}
              <div className="break-words">
                {isBetCommand && '💰 Placed bet!'}
                {isProveCommand && '🏃 Proving workout...'}
                {!isBetCommand && !isProveCommand && content}
              </div>
              <div className="text-xs opacity-50 mt-1">
                {new Date(message.sent).toLocaleTimeString()}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

function MessageInput({ conversation, messageInput, setMessageInput }: any) {
  const { sendMessage } = useSendMessage();
  
  const handleSend = async () => {
    if (!messageInput.trim()) return;
    
    try {
      await sendMessage(conversation, messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-lg p-4 border-t border-white/20">
      <div className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type !bet or !prove..."
          className="flex-1 bg-white/20 backdrop-blur text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
          onClick={handleSend}
          className="bg-white text-sweat-purple p-3 rounded-xl hover:scale-105 transition-transform"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
