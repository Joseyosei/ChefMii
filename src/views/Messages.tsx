import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, MessageCircle, User, Wallet, LogOut, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ChefMiiLogo from '@/components/ChefMiiLogo';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  unread?: boolean;
  other_user_id: string;
}

export default function Messages() {
  const { user, signOut } = useAuth();
  const [activeNav, setActiveNav] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Chef Emma',
      lastMessage: 'Looking forward to cooking for you!',
      avatar: '/placeholder.svg',
      other_user_id: 'chef-emma-id',
    },
    {
      id: '2',
      name: 'Chef David',
      lastMessage: 'The menu is ready for review.',
      avatar: '/placeholder.svg',
      other_user_id: 'chef-david-id',
    },
    {
      id: '3',
      name: 'Chef Maria',
      lastMessage: 'See you on Saturday!',
      avatar: '/placeholder.svg',
      other_user_id: 'chef-maria-id',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !selectedConversation) return;

    // Fetch messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedConversation.other_user_id}),and(sender_id.eq.${selectedConversation.other_user_id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to realtime messages
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === user.id && newMsg.receiver_id === selectedConversation.other_user_id) ||
            (newMsg.sender_id === selectedConversation.other_user_id && newMsg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!messageInput.trim() || !user || !selectedConversation) return;
    
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedConversation.other_user_id,
      content: messageInput.trim(),
    });

    if (!error) {
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r border-border p-6">
          <ChefMiiLogo className="mb-8" />
          <nav className="space-y-2">
            <Link to="/user-dashboard">
              <button
                onClick={() => setActiveNav('dashboard')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                  activeNav === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </Link>
            <button
              onClick={() => setActiveNav('calendar')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'calendar' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setActiveNav('messages')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'messages' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Messages</span>
            </button>
            <button
              onClick={() => setActiveNav('profile')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'profile' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveNav('payouts')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'payouts' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span>Payouts</span>
            </button>
          </nav>
          <button 
            onClick={signOut}
            className="flex items-center gap-3 w-full px-4 py-3 mt-8 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex">
          {/* Conversations List */}
          <div className="w-80 border-r border-border bg-card">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold">Messages</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 border-b border-border hover:bg-muted transition-colors text-left ${
                    selectedConversation?.id === conv.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={conv.avatar} />
                      <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{conv.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-border bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.avatar} />
                      <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedConversation.name}</h2>
                      <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md p-4 rounded-lg ${
                            msg.sender_id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm mb-1">{msg.content}</p>
                          <p className={`text-xs ${
                            msg.sender_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-6 border-t border-border bg-card">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1"
                    />
                    <Button onClick={handleSend}>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
