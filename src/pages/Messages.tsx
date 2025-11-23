import { useState } from 'react';
import { Home, Calendar as CalendarIcon, MessageCircle, User, Wallet, LogOut, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  sender: 'user' | 'client';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  status?: string;
  avatar: string;
  unread?: boolean;
}

export default function Messages() {
  const [activeNav, setActiveNav] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState('Ian M');
  const [messageInput, setMessageInput] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Ian M',
      lastMessage: 'Hi Chef, need BBQ for family of 20 this...',
      status: 'New Request',
      avatar: '/placeholder.svg',
      unread: true
    },
    {
      id: '2',
      name: 'Rachel G',
      lastMessage: 'Thanks for yesterday\'s dinner! Ready for next…',
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Clementine L',
      lastMessage: 'Looking for vegan menu in London on 12th…',
      status: 'Pending Details',
      avatar: '/placeholder.svg'
    }
  ];

  const [chats, setChats] = useState<Record<string, Message[]>>({
    'Ian M': [
      { id: 1, sender: 'client', text: "Hi Chef Olivia, we'd love you for June 5th BBQ—available?", time: '10:30 AM' },
      { id: 2, sender: 'user', text: "Hello Ian! Yes, I'm available. What time works for you?", time: '10:32 AM' },
      { id: 3, sender: 'client', text: "7 pm for 12 people. Also need vegetarian options.", time: '10:35 AM' }
    ],
    'Rachel G': [
      { id: 1, sender: 'client', text: "Thanks for yesterday's dinner! Ready for next…", time: 'Yesterday' }
    ],
    'Clementine L': [
      { id: 1, sender: 'client', text: "Looking for vegan menu in London on 12th…", time: '2 days ago' }
    ]
  });

  const handleSend = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: chats[selectedConversation].length + 1,
      sender: 'user',
      text: messageInput,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setChats({
      ...chats,
      [selectedConversation]: [...chats[selectedConversation], newMessage]
    });
    setMessageInput('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r border-border p-6">
          <h2 className="text-2xl font-bold text-primary mb-8">ChefMe</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
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
          <button className="flex items-center gap-3 w-full px-4 py-3 mt-8 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex">
          {/* Conversations List */}
          <div className="w-96 border-r border-border bg-card">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold">Messages</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.name)}
                  className={`w-full p-4 border-b border-border hover:bg-muted transition-colors text-left ${
                    selectedConversation === conv.name ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={conv.avatar} />
                      <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{conv.name}</h3>
                        {conv.status && (
                          <span className="text-xs text-primary font-medium">{conv.status}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{selectedConversation.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{selectedConversation}</h2>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {chats[selectedConversation]?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md p-4 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm mb-1">{msg.text}</p>
                      <p className={`text-xs ${
                        msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
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
          </div>
        </main>
      </div>
    </div>
  );
}
